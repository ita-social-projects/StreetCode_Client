// import './ArtGalleryAdminBlock.styles.scss';
import './ArtGalleryAdminStyles.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { getImageSize } from 'react-image-size';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { useRouteId } from '@hooks/stateful/useRouter.hook';
import { IndexedArt } from '@models/media/art.model';
import useMobx from '@stores/root-store';

import ArtGallerySlide from '@/features/StreetcodePage/ArtGalleryBlock/ArtGalleryListOfItem/ArtGallerySlide.component';

const SECTION_AMOUNT = 6;

const PreviewBlock = () => {
    const { streetcodeArtStore } = useMobx();
    const { fetchStreetcodeArtsByStreetcodeId, getStreetcodeArtArray } = streetcodeArtStore;

    const streetcodeId = useRouteId();
    const [indexedArts, setIndexedArts] = useState<IndexedArt[]>([]);

    useAsync(
        () => fetchStreetcodeArtsByStreetcodeId(streetcodeId),
        [streetcodeId],
    );

    function resizeImage(width : number, height : number) : number {
        let commonWidth = 380;

        if (width <= height) {
            width = commonWidth;
            height = 535;
            return 2;
        } if ((width > height && height <= 300)) {
            width = commonWidth;
            height = 253;
            return 1;
        }

        width = 806;
        height = 536;
        return 4;
    }

    useEffect(() => {
        const newMap: IndexedArt[] = [];
        getStreetcodeArtArray?.forEach(async ({ art: { description, image }, index }) => {
            try {
                const { width, height } = await getImageSize(image.url.href);
                console.log(image.url.title);
                console.log('w: ', width);
                console.log('h: ', height);

                newMap.push({
                    index,
                    description,
                    imageHref: image.url.href,
                    title: image.url.title,
                    offset: resizeImage(width, height) 
                    //(width <= height) ? 2 : (width > height && height <= 300) ? 1 : 4,
                } as IndexedArt);
            } catch (error: unknown) {
                console.log(`Error: cannot parse the image url: ${image.url.href}`);
            }
            setIndexedArts(newMap);
        });
    }, [getStreetcodeArtArray]);

   
    // (width <= height) ? 2 : (width > height && height <= 300) ? 1 : 4,

    const sortedArtsList = [...indexedArts].sort((a, b) => a.index - b.index);
    let offsetSumForSlide = 0;
    let offsetSum = 0;
    let sequenceNumber = -1;

    const slideOfArtList = [];
    let artsData: IndexedArt[] = [];

    sortedArtsList.forEach(({
        index, offset, imageHref, description, title,
    }) => {
        if (offsetSumForSlide !== SECTION_AMOUNT) {
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

    return (
        <div className="artGalleryWrapper">
            <div className="artGalleryContainer">
                <div className="artGalleryContentContainer">
                    <div className="artGallerySliderContainer">
                        <SlickSlider
                            infinite={false}
                            swipe={false}
                            slidesToShow={1}
                        >
                            {slideOfArtList}
                        </SlickSlider>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(PreviewBlock);

/*
import './ArtGalleryBlock.styles.scss';

// import Rectangle106_2 from '@images/art-gallery/Rectangle106_2.png';
// import Rectangle107_2 from '@images/art-gallery/Rectangle107_2.png';
// import Rectangle108_2 from '@images/art-gallery/Rectangle108_2.png';
// import Rectangle109_2 from '@images/art-gallery/Rectangle109_2.png';
// import Rectangle110_2 from '@images/art-gallery/Rectangle110_2.png';
// import Rectangle111_2 from '@images/art-gallery/Rectangle111_2.png';

const ArtGalleryBlock = () => {
    const { streetcodeArtStore } = useMobx();
    const { fetchStreetcodeArtsByStreetcodeId, getStreetcodeArtArray } = streetcodeArtStore;

    const streetcodeId = useRouteId();
    const [indexedArts, setIndexedArts] = useState<IndexedArt[]>([]);

    useAsync(
        () => fetchStreetcodeArtsByStreetcodeId(streetcodeId),
        [streetcodeId],
    );

    // console.log(
    //     Rectangle106_2,
    //     Rectangle107_2,
    //     Rectangle109_2,
    //     Rectangle110_2,
    //     Rectangle111_2,
    //     Rectangle108_2,
    // );

    useEffect(() => {
        const newMap: IndexedArt[] = [];

        getStreetcodeArtArray?.forEach(async ({ art: { description, image }, index }) => {
            try {
                const { width, height } = await getImageSize(image.url.href);

                newMap.push({
                    index,
                    description,
                    imageHref: image.url.href,
                    title: image.url.title,
                    offset: (width <= height) ? 2 : (width > height && height <= 300) ? 1 : 4,
                } as IndexedArt);
            } catch (error: unknown) {
                console.log(`Error: cannot parse the image url: ${image.url.href}`);
            }
            setIndexedArts(newMap);
        });
    }, [getStreetcodeArtArray]);

    const sortedArtsList = [...indexedArts].sort((a, b) => a.index - b.index);
    let offsetSumForSlide = 0;
    let offsetSum = 0;
    let sequenceNumber = -1;

    const slideOfArtList = [];
    let artsData: IndexedArt[] = [];

    sortedArtsList.forEach(({
        index, offset, imageHref, description, title,
    }) => {
        if (offsetSumForSlide !== SECTION_AMOUNT) {
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

    return (
        <div className="artGalleryWrapper">
            <div className="artGalleryContainer">
                <BlockHeading headingText="Арт-галерея" />
                <div className="artGalleryContentContainer">
                    <div className="artGallerySliderContainer">
                        <SlickSlider
                            infinite={false}
                            swipe={false}
                            slidesToShow={1}
                        >
                            {slideOfArtList}
                        </SlickSlider>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(ArtGalleryBlock);

*/
