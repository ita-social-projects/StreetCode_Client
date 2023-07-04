/* eslint-disable complexity */
/* eslint-disable brace-style */
/* eslint-disable arrow-parens */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable react/prop-types */
import './ArtGalleryAdminStyles.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { getImageSize } from 'react-image-size';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import { IndexedArt } from '@models/media/art.model';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import ArtGallerySlide from '@/features/StreetcodePage/ArtGalleryBlock/ArtGalleryListOfItem/ArtGallerySlide.component';
import { StreetcodeArtCreateUpdate } from '@/models/media/streetcode-art.model';

const SECTION_AMOUNT = 6;

interface Props {
    arts: StreetcodeArtCreateUpdate[],
}

const ArtGalleryAdminBlock = ({ arts }: Props) => {
    const [indexedArts, setIndexedArts] = useState<IndexedArt[]>([]);
    const isAdminPage = true;

    useEffect(() => {
        const newMap: IndexedArt[] = [];

        arts!.forEach(async (streetcodeArt) => {
            try {
                if (streetcodeArt.art.image) {
                    const url = base64ToUrl(streetcodeArt.art.image.base64, streetcodeArt.art.image.mimeType);
                    const { width, height } = await getImageSize(url!);
                    const { index } = streetcodeArt;
                    const { description } = streetcodeArt.art;
                    const { title } = streetcodeArt.art;

                    newMap.push({
                        index,
                        description,
                        imageHref: url,
                        title,
                        offset: (width <= height) ? 2 : (width > height && height <= 300) ? 1 : 4,
                    } as IndexedArt);
                }
            } catch (error: unknown) { /* empty */ }

            setIndexedArts(newMap);
        });
    }, [arts]);

    const sortedArtsList = [...indexedArts].sort((a, b) => a.index - b.index);

    let offsetSumForSlide = 0;
    let offsetSum = 0;
    let sequenceNumber = -1;
    const windowsize = useWindowSize();

    const slideOfArtList = [];
    let artsData: IndexedArt[] = [];
    sortedArtsList.forEach(({
        index, offset, imageHref, description, title,
    }) => {
        if (offsetSumForSlide !== SECTION_AMOUNT && offsetSumForSlide + offset <= SECTION_AMOUNT) {
            offsetSumForSlide += offset ?? 0;
            offsetSum += offset ?? 0;
            sequenceNumber = index - 1;
            artsData.push({
                index,
                imageHref,
                description,
                offset,
                title,
                sequenceNumber,
            } as IndexedArt);
            if (artsData.length >= 2) {
                if (artsData[0].offset === 1 && artsData[1].offset != 1) {
                    sortedArtsList.forEach((x) => {
                        if (x.index === artsData[0].index) x.offset = 4;
                    });
                    slideOfArtList.push(
                        <ArtGallerySlide artGalleryList={artsData} isAdminPage={isAdminPage} />,
                    );
                    artsData = [];
                    offsetSumForSlide = 0;
                    offsetSum = 0;
                }
            }
        } else if (artsData.length > 0 && (offsetSumForSlide + offset > SECTION_AMOUNT)) {
            slideOfArtList.push(
                <ArtGallerySlide artGalleryList={artsData} isAdminPage={isAdminPage} />,
            );
            sequenceNumber = index - 1;
            artsData = [{
                index,
                imageHref,
                description,
                offset,
                title,
                sequenceNumber,
            } as IndexedArt];

            offsetSumForSlide = offset ?? 0;
            offsetSum = offset ?? 0;
        }

        if (offsetSumForSlide === SECTION_AMOUNT) {
            offsetSumForSlide = 0;
            slideOfArtList.push(
                <ArtGallerySlide artGalleryList={artsData} isAdminPage={isAdminPage} />,
            );
            artsData = [];
        }
    });

    if (!Number.isInteger(offsetSum / SECTION_AMOUNT)) {
        slideOfArtList.push(
            <ArtGallerySlide artGalleryList={artsData} isAdminPage={isAdminPage} />,
        );
    }

    let offsetTmp = 0;

    sortedArtsList.forEach((x) => offsetTmp += x.offset);

    let offsetSlide = offsetTmp % 6;

    let lastSlide: IndexedArt[] = [];

    let currentV = 0;

    for (let i = sortedArtsList.length - 1; i >= 0 && currentV < offsetSlide; i--) {
        lastSlide.push(sortedArtsList[i]);
        currentV += sortedArtsList[i].offset;
    }

    lastSlide = lastSlide.reverse();

    if (lastSlide.length >= 2) {
        if (lastSlide[0].offset === 1 && lastSlide[1].offset != 1) {
            lastSlide.splice(1, 1);
            lastSlide.splice(0, 1);
            offsetSlide += 3;
            if (offsetSlide > 6) {
                offsetSlide -= 6;
            }
        }
    }

    if (offsetSlide === 3 && offsetSlide > 0 && lastSlide.every((x) => x.offset === 1)) {
        lastSlide[0].offset = 4;
    }

    if (offsetSlide < 3 && offsetSlide > 0) {
        lastSlide.forEach((x) => {
            if (x.offset === 1) x.offset = 4;
        });
    }

    const sliderProps = {
        className: 'artGallerySliderContainer',
        infinite: false,
        swipe: windowsize.width <= 1024,
        swipeOnClick: false,
        slidesToShow: windowsize.width >= 768 ? 1 : windowsize.width >= 480 ? 1 : undefined,
        slidesToScroll: windowsize.width >= 768 ? 1 : windowsize.width >= 480 ? 1 : 3,
    };

    return (
        <div className="artGalleryWrapperAdmin">
            <div className="artGalleryContainerAdmin">
                <div className="artGalleryContentContainerAdmin">
                    <div className="artGallerySliderContainerAdmin">
                        <SlickSlider {...sliderProps}>
                            {slideOfArtList.map((slide, index) => (
                                <div key={index}>{slide}</div>
                            ))}
                        </SlickSlider>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(ArtGalleryAdminBlock);
