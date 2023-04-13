import './ArtGalleryAdminStyles.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { getImageSize } from 'react-image-size';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { IndexedArt } from '@models/media/art.model';
import useMobx from '@stores/root-store';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import ArtGallerySlide from '@/features/StreetcodePage/ArtGalleryBlock/ArtGalleryListOfItem/ArtGallerySlide.component';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';

const SECTION_AMOUNT = 6;

interface Art {
    description: string;
    image: string;
    index: number;
    title: string;
}

const ArtGalleryAdminBlock: React.FC<Art[] | undefined> = ({ art }) => {
    const { streetcodeArtStore, streetcodeStore: { getStreetCodeId } } = useMobx();
    const { fetchStreetcodeArtsByStreetcodeId, getStreetcodeArtArray } = streetcodeArtStore;
    const [indexedArts, setIndexedArts] = useState<IndexedArt[]>([]);
    const isAdminPage = true;

    useEffect(() => {
        const newMap: IndexedArt[] = [];
        art?.forEach(async ({ description, image, index, title }) => {
            try {
                if (image) {

                    const { width, height } = await getImageSize(image);

                    newMap.push({
                        index,
                        description,
                        imageHref: image,
                        title,
                        offset: (width <= height) ? 2 : (width > height && height <= 300) ? 1 : 4,
                    } as IndexedArt);
                }
            } catch (error: unknown) {
                console.log(`Error: cannot parse the image url: ${image}`);
            }
            setIndexedArts(newMap);
        });
    }, [art]);

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
            sequenceNumber += 1;
            artsData.push({
                index,
                imageHref,
                description,
                offset,
                title,
                sequenceNumber,
            } as IndexedArt);
        }
        else if (artsData.length > 0 && offsetSumForSlide + offset > SECTION_AMOUNT) {
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
        className: "artGallerySliderContainer",
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
                        </SlickSlider >
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(ArtGalleryAdminBlock);