import './ArtGallery.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { getImageSize } from 'react-image-size';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { useRouteId } from '@/app/common/hooks/stateful/useRouter.hook';

import ArtGalleryListOfItem from './ArtGalleryListOfItem/ArtGalleryListOfItem.component';

type IndexedArt = {
    index: number;
    description?: string;
    imageHref: string;
    offset?: number;
};

const SECTION_AMOUNT = 6;

const ArtGallery = () => {
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
                    offset: (width <= height) ? 1 : 2,
                } as IndexedArt);
            } catch (error: unknown) {
                console.log(`Error: cannot parse the image url: ${image.url.href}`);
            }
        });

        setIndexedArts(newMap);
    }, [getStreetcodeArtArray]);

    console.log(indexedArts);

    const sortedArtsMap = [...indexedArts].sort((a, b) => a.index - b.index);

    let j = 0;
    let jCount = 0;

    const slideOfArtList = [];
    let arts: IndexedArt[] = [];

    const artGalleryListOfItem = (
        <ArtGalleryListOfItem images={arts.map((i) => i.imageHref)} />
    );

    sortedArtsMap.forEach(({ index, offset, imageHref }) => {
        if (j !== SECTION_AMOUNT) {
            j += offset ?? 0;
            jCount += offset ?? 0;
            arts.push({ index, imageHref } as IndexedArt);
        } else {
            j = 0;
            slideOfArtList.push(artGalleryListOfItem);
            arts = [];
        }
    });

    if (!Number.isInteger(jCount / SECTION_AMOUNT)) {
        slideOfArtList.push(artGalleryListOfItem);
    }

    const imgSrc = `https://uk.wikipedia.org/wiki/%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA_
    %D0%BA%D0%B0%D1%80%D1%82%D0%B8%D0%BD_%D1%96_%D0%BC%D0%B0%D0%BB%D1%8E%D0%BD%D0%BA%D1%96%D0%B2_
    %D0%A2%D0%B0%D1%80%D0%B0%D1%81%D0%B0_%D0%A8%D0%B5%D0%B2%D1%87%D0%B5%D0%BD%D0%BA%D0%B0#/
    media/%D0%A4%D0%B0%D0%B9%D0%BB:Portret_nevidomoho_Shevchenko_.jpg`;

    return (
        <div className="artGalleryWrapper">
            <img src={imgSrc} alt="" />
            <div className="artGalleryContainer">
                <BlockHeading headingText="Арт-галерея" />
                {/* <div className="artGalleryContentContainer">
                    <div className="artGallerySliderContainer">

                        <SlickSlider
                            infinite={false}
                            swipe={false}
                            dots={true}
                            rows={1}
                            slidesToShow={1}
                           // slides={sliderItems}
                            // slides={[<ArtGalleryListOfItem arts={artsHrefs}/>,
                            //       //   <ArtGalleryListOfItem arts={[Rectangle108,Rectangle107,
                            Rectangle107,Rectangle109,Rectangle109]}/>
                            //         ]}
                            slides={listArt}
                        />
                    </div>
                </div>  */}
                <div className="artGalleryContentContainer">
                    <div className="artGallerySliderContainer">
                        <SlickSlider
                            infinite={false}
                            swipe={false}
                            dots
                            rows={1}
                            slidesToShow={1}
                            slides={slideOfArtList}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(ArtGallery);
