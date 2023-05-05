import './ArtGalleryAdminStyles.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { getImageSize } from 'react-image-size';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import { ArtCreate, IndexedArt } from '@models/media/art.model';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import ArtGallerySlide from '@/features/StreetcodePage/ArtGalleryBlock/ArtGalleryListOfItem/ArtGallerySlide.component';

const SECTION_AMOUNT = 6;

const ArtGalleryAdminBlock: React.FC<{ arts: ArtCreate[] }> = ({ arts }) => {
    const [indexedArts, setIndexedArts] = useState<IndexedArt[]>([]);
    const isAdminPage = true;
    useEffect(() => {
        const newMap: IndexedArt[] = [];
        arts!.forEach(async ({
            description, image, index, title, mimeType,
        }) => {
            try {
                if (image) {
                    const url = base64ToUrl(image, mimeType);
                    const { width, height } = await getImageSize(url!);
                    newMap.push({
                        index,
                        description,
                        imageHref: url,
                        title,
                        offset: (width <= height) ? 2 : (width > height && height <= 300) ? 1 : 4,
                    } as IndexedArt);
                }
            } catch (error: unknown) {
                console.log(`Error: cannot parse the image url: ${image}`);
            }
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
    const offsetAll = useRef<number>(0);

    sortedArtsList.forEach(({
        index, offset, imageHref, description, title,
    }) => {
        if (offsetAll.current>6)
            offsetAll.current -= offsetAll.current % 6;

        if ((offsetAll.current % 6) < 3 && offsetAll.current > 0 && offset === 1) {
            offset = 4;
        }
        else if ((offsetAll.current % 6) === 3 && offsetAll.current > 0 && offset === 1 && sortedArtsList[0].offset === 1) {
            sortedArtsList[0].offset = 4;
        }
        else if ((offsetAll.current % 6) > 6 && offsetAll.current > 0 && offset === 1) {
            
            for (let i = 0; i < sortedArtsList.length; i++) {
                if (sortedArtsList[i].offset === 1 && sortedArtsList[i + 1].offset === 2) {
                    sortedArtsList[i].offset = 4;
                }
                else {
                    offset = 1;
                }
            }

        }
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
                <ArtGallerySlide artGalleryList={artsData} isAdminPage={isAdminPage} />,
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
                        <SlickSlider
                            {...sliderProps}
                        >
                            {slideOfArtList}
                        </SlickSlider>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(ArtGalleryAdminBlock);
