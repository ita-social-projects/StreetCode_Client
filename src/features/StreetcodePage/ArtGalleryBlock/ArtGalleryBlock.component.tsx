import './ArtGalleryBlock.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { getImageSize } from 'react-image-size';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import SlickSliderSmall from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { IndexedArt } from '@models/media/art.model';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

import ArtGallerySlide from './ArtGalleryListOfItem/ArtGallerySlide.component';
import ArtGallerySlideSmall from './ArtGalleryListOfItem/ArtGallerySlide.component';

const SECTION_AMOUNT = 6;
const SECTION_AMOUNT_SMALL = 2;

const ArtGalleryBlock = () => {
    const { streetcodeArtStore, streetcodeStore } = useMobx();
    const { getStreetCodeId, errorStreetCodeId } = streetcodeStore;
    const { fetchStreetcodeArtsByStreetcodeId, getStreetcodeArtArray } = streetcodeArtStore;
    const [indexedArts, setIndexedArts] = useState<IndexedArt[]>([]);
    const [indexedArtsSmall, setIndexedArtsSmall] = useState<IndexedArt[]>([]);
    const windowsize = useWindowSize();

    const sortedArtsList = [...indexedArts].sort((a, b) => a.index - b.index);
    let offsetSumForSlide = 0;
    let offsetSum = 0;
    let sequenceNumber = -1;
    const slideOfArtList = [];
    let artsData: IndexedArt[] = [];

    const sortedArtsListSmall = [...indexedArtsSmall].sort((a, b) => a.index - b.index);
    const slideOfArtListSmall = [];
    let offsetSumForSlideSmall = 0;
    let offsetSumSmall = 0;
    let sequenceNumberSmall = -1;
    let artsDataSmall: IndexedArt[] = [];

    useAsync(
        () => {
            if (getStreetCodeId !== errorStreetCodeId) {
                fetchStreetcodeArtsByStreetcodeId(getStreetCodeId);
            }
        },
        [getStreetCodeId, fetchStreetcodeArtsByStreetcodeId],
    );

    useEffect(() => {
        const newMap: IndexedArt[] = [];
        getStreetcodeArtArray?.forEach(async ({ art: { description, image }, index }) => {
            try {
                var url = base64ToUrl(image.base64, image.mimeType);
                if (url) {
                    const { width, height } = await getImageSize(url);

                    newMap.push({
                        index,
                        description,
                        imageHref: url,
                        title: image.alt,
                        offset: (width <= height) ? 2 : (width > height && height <= 300) ? 1 : 4,
                    } as IndexedArt);
                }
            } catch (error: unknown) {
                console.log(`Error: cannot parse the image url: ${url}`);
            }
            setIndexedArts(newMap);
            setIndexedArtsSmall(newMap);
        });
    }, [getStreetcodeArtArray]);

    sortedArtsList.forEach(({
        index, offset, imageHref, description, title,
    }) => {
        if (offsetSumForSlide !== SECTION_AMOUNT && offsetSumForSlide + offset <= SECTION_AMOUNT) {
            offsetSumForSlide += offset ?? 0;
            offsetSum += offset ?? 0;
            sequenceNumber += 1;
            artsData.push({
                index,
                imageHref,
                description,
                offset,
                title,
                sequenceNumber,
            } as IndexedArt);
        } else if (artsData.length > 0 && offsetSumForSlide + offset > SECTION_AMOUNT) {
            slideOfArtList.push(
                <ArtGallerySlide artGalleryList={artsData} />,
            );
            artsData = [{
                index,
                imageHref,
                description,
                offset,
                title,
                sequenceNumber: sequenceNumber + 1,
            } as IndexedArt];

            offsetSumForSlide = offset ?? 0;
            offsetSum = offset ?? 0;
        }
        if (offsetSumForSlide === SECTION_AMOUNT) {
            offsetSumForSlide = 0;
            slideOfArtList.push(
                <ArtGallerySlide artGalleryList={artsData} />,
            );
            artsData = [];
        }
    });

    if (!Number.isInteger(offsetSum / SECTION_AMOUNT)) {
        slideOfArtList.push(
            <ArtGallerySlide artGalleryList={artsData} />,
        );
    }

    sortedArtsListSmall.forEach(({
        index, offset, imageHref, description, title,
    }) => {
        if (offsetSumForSlideSmall !== SECTION_AMOUNT_SMALL && offsetSumForSlide + offset <= SECTION_AMOUNT) {
            if (offset == 4) {
                offset = 1;
            }
            offsetSumForSlideSmall += offset ?? 0;
            offsetSumSmall += offset ?? 0;
            sequenceNumberSmall += 1;
            artsDataSmall.push({
                index,
                imageHref,
                description,
                offset,
                title,
                sequenceNumber: sequenceNumberSmall,
            } as IndexedArt);
        } else if (artsData.length > 0 && offsetSumForSlide + offset > SECTION_AMOUNT) {
            slideOfArtList.push(
                <ArtGallerySlide artGalleryList={artsData} />,
            );
            artsData = [{
                index,
                imageHref,
                description,
                offset,
                title,
                sequenceNumber: sequenceNumber + 1,
            } as IndexedArt];
            offsetSumForSlide = offset ?? 0;
            offsetSum = offset ?? 0;
        }
        if (offsetSumForSlideSmall === SECTION_AMOUNT_SMALL) {
            offsetSumForSlideSmall = 0;
            slideOfArtListSmall.push(
                <ArtGallerySlideSmall artGalleryList={artsDataSmall} />,
            );
            artsDataSmall = [];
        }
    });

    if (!Number.isInteger(offsetSumSmall / SECTION_AMOUNT_SMALL)) {
        slideOfArtListSmall.push(
            <ArtGallerySlideSmall artGalleryList={artsDataSmall} />,
        );
    }

    const sliderProps = {
        className: 'artGallerySliderContainer',
        infinite: false,

        swipe: windowsize.width <= 1024,
        swipeOnClick: false,
        slidesToShow: windowsize.width >= 768 ? 1 : windowsize.width >= 480 ? 1 : undefined,
        slidesToScroll: windowsize.width >= 768 ? 1 : windowsize.width >= 480 ? 1 : 3,
    };

    const sliderPropsSmall = {
        className: 'artGallarySliderContainerSmall',
        infinite: true,
        swipe: true,
        swipeOnClick: false,
        centerMode: true,
        variableWidth: true,
        slidesToShow: 1,
        centerPadding: '0px 10px',
        slidesToScroll: 0.5,
        touchAction: 'pan-y',
        touchThreshold: 15,
        transform: 'translateZ(0)',
    };

    return (
        <div className="artGalleryWrapper">
            <div className="artGalleryContainer">
                <BlockHeading headingText="Арт-галерея" />
                <div className="artGalleryContentContainer">
                    <div className="artGallerySliderContainer">
                        {windowsize.width >= 768 && (
                            <SlickSlider
                                {...sliderProps}
                            >
                                {slideOfArtList}
                            </SlickSlider>
                        )}
                        {windowsize.width < 768 && (
                            <SlickSliderSmall

                                {...sliderPropsSmall}
                            >
                                {slideOfArtListSmall}
                            </SlickSliderSmall>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(ArtGalleryBlock);
