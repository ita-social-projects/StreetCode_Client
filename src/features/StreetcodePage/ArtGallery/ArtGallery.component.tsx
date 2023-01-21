import './ArtGallery.styles.scss';

import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { getImageSize } from 'react-image-size';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { useRouteId } from '@/app/common/hooks/stateful/useRouter.hook';

import ArtGalleryListOfItem from './ArtGalleryListOfItem/ArtGalleryListOfItem.component';

interface StreetcodeArtGallery {
    index: number;
    description?: string;
    imageHref: string;
  }

const ArtGallery = () => {
    const { streetcodeArtStore } = useMobx();
    const { fetchStreetcodeArtsByStreetcodeId, getStreetcodeArtArray } = streetcodeArtStore;

    const streetcodeId = useRouteId();
    const [artMap, setArtMap] = useState(new Map<number, [string, number]>());

    useAsync(
        () => fetchStreetcodeArtsByStreetcodeId(streetcodeId),
        [streetcodeId],
    );

    const StreetcodeArtFunc = useCallback(
        () => getStreetcodeArtArray?.map(({ art: { description, image }, index }) => ({
            index,
            description,
            imageHref: image.url.href,
        })),
        [getStreetcodeArtArray],
    );

    useEffect(() => {
        const newMap = new Map<number, [string, number]>();
        const streetcodeArtGalleryData = StreetcodeArtFunc();

        streetcodeArtGalleryData?.forEach(async ({ index, imageHref }) => {
            try {
                const { width, height } = await getImageSize(streetcodeArtGalleryData[0].imageHref);
                newMap.set(index, [imageHref, (width > height) ? 2 : 1]);
                setArtMap(newMap);
            } catch (error: unknown) {
                console.log(error);
            }
        });
    }, [StreetcodeArtFunc]);

    // console.log(artMap);

    const sortNumArt = new Map([...artMap].sort((a, b) => a[0] - b[0]));
    let j = 0;
    let arr: string[] = [];
    const slideOfArtList = [];
    let obj: StreetcodeArtGallery[] = [];
    // console.log(sortNumArt)
    let jCount = 0;
    for (const [key, value] of sortNumArt) {
        if (j != 6) {
            // console.log(`${key} = ${value[0]}-${value[1]}`);
            j += value[1];
            jCount += value[1];
            arr.push(value[0]);
            obj.push({ index: key, imageHref: value[0] });
            // console.log(obj)
        }
        if (j == 6) {
            j = 0;
            // console.log('......................');
            // listArt.push(<ArtGalleryListOfItem images={arr}/>)
            slideOfArtList.push(<ArtGalleryListOfItem images={obj.map((i) => i.imageHref)} />);
            arr = [];
            obj = [];
        }
    }

    if (!Number.isInteger(jCount / 6)) {
        // listArt.push(<ArtGalleryListOfItem images={arr}/>)
        slideOfArtList.push(<ArtGalleryListOfItem images={obj.map((i) => i.imageHref)} />);
    }

    return (

        <div className="artGalleryWrapper">
            <img src="https://uk.wikipedia.org/wiki/%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA_%D0%BA%D0%B0%D1%80%D1%82%D0%B8%D0%BD_%D1%96_%D0%BC%D0%B0%D0%BB%D1%8E%D0%BD%D0%BA%D1%96%D0%B2_%D0%A2%D0%B0%D1%80%D0%B0%D1%81%D0%B0_%D0%A8%D0%B5%D0%B2%D1%87%D0%B5%D0%BD%D0%BA%D0%B0#/media/%D0%A4%D0%B0%D0%B9%D0%BB:Portret_nevidomoho_Shevchenko_.jpg" />
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
                            // slides={[<ArtGalleryListOfItem images={arr}/>,
                            //       //   <ArtGalleryListOfItem images={[Rectangle108,Rectangle107,
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
