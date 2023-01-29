import './ArtGalleryBlock.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { getImageSize } from 'react-image-size';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { useRouteId } from '@hooks/stateful/useRouter.hook';
import { IndexedArt } from '@models/media/art.model';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import ArtGallerySlide from './ArtGalleryListOfItem/ArtGallerySlide.component';

const SECTION_AMOUNT = 6;

const ArtGalleryBlock = () => {
    const { streetcodeArtStore } = useMobx();
    const { fetchStreetcodeArtsByStreetcodeId, getStreetcodeArtArray } = streetcodeArtStore;

    const streetcodeId = useRouteId();
    const [indexedArts, setIndexedArts] = useState<IndexedArt[]>([]);

    useAsync(
        () => fetchStreetcodeArtsByStreetcodeId(streetcodeId),
        [streetcodeId],
    );

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
                            slides={slideOfArtList}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(ArtGalleryBlock);
