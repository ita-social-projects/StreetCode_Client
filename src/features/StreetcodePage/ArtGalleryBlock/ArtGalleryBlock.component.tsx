/* eslint-disable complexity */
import './ArtGalleryBlock.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { getImageSize } from 'react-image-size';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { IndexedArt } from '@models/media/art.model';
import useMobx, { useStreecodePageLoaderContext, useStreetcodeDataContext } from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

import ArtGallerySlide from './ArtGalleryListOfItem/ArtGallerySlide.component';
import ArtGallerySlideSmall from './ArtGalleryListOfItem/ArtGallerySlide.component';

const SECTION_AMOUNT = 6;
const SECTION_AMOUNT_SMALL = 2;

const ArtGalleryBlock = () => {
    const { streetcodeArtStore } = useMobx();
    const { streetcodeStore: { getStreetCodeId, errorStreetCodeId } } = useStreetcodeDataContext();
    const streecodePageLoaderContext = useStreecodePageLoaderContext();
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
                fetchStreetcodeArtsByStreetcodeId(getStreetCodeId)
                    .then(() => streecodePageLoaderContext.addBlockFetched());
            }
        },
        [getStreetCodeId, fetchStreetcodeArtsByStreetcodeId],
    );

    useEffect(() => {
        const newMap: IndexedArt[] = [];
        getStreetcodeArtArray?.forEach(async ({ art: { description, title, image }, index }) => {
            try {
                const url = base64ToUrl(image.base64, image.mimeType);
                if (url) {
                    const { width, height } = await getImageSize(url);

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
            setIndexedArtsSmall(newMap);
        });
    }, [getStreetcodeArtArray]);

    const offsetAll = useRef<number>(0);

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
                if (artsData[0].offset === 1 && artsData[1].offset !== 1) {
                    sortedArtsList.forEach((x) => {
                        if (x.index === artsData[0].index) x.offset = 4;
                    });
                    slideOfArtList.push(
                        <ArtGallerySlide key={index} artGalleryList={artsData} />,
                    );
                    artsData = [];
                    offsetSumForSlide = 0;
                    offsetSum = 0;
                }
            }
        } else if (artsData.length > 0 && offsetSumForSlide + offset > SECTION_AMOUNT) {
            slideOfArtList.push(
                <ArtGallerySlide key={index} artGalleryList={artsData} />,
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
                <ArtGallerySlide key={index} artGalleryList={artsData} />,
            );
            artsData = [];
        }
    });

    if (!Number.isInteger(offsetSum / SECTION_AMOUNT)) {
        slideOfArtList.push(
            <ArtGallerySlide key={artsData.length} artGalleryList={artsData} />,
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

    sortedArtsListSmall.forEach(({
        index, offset, imageHref, description, title,
    }) => {
        if (offset === 4) {
            offset = 1;
        }
        if (offsetSumForSlideSmall !== SECTION_AMOUNT_SMALL
            && offsetSumForSlideSmall + offset <= SECTION_AMOUNT_SMALL) {
            offsetSumForSlideSmall += offset ?? 0;
            offsetSumSmall += offset ?? 0;
            sequenceNumberSmall = index - 1;
            artsDataSmall.push({
                index,
                imageHref,
                description,
                offset,
                title,
                sequenceNumber: sequenceNumberSmall,
            } as IndexedArt);
        } else if (artsDataSmall.length > 0 && offsetSumForSlideSmall + offset > SECTION_AMOUNT_SMALL) {
            sequenceNumberSmall = index - 1;
            slideOfArtListSmall.push(
                <ArtGallerySlideSmall key={index} artGalleryList={artsDataSmall} />,
            );
            artsDataSmall = [{
                index,
                imageHref,
                description,
                offset,
                title,
                sequenceNumber: sequenceNumberSmall,
            } as IndexedArt];
            offsetSumForSlideSmall = offset ?? 0;
            offsetSumSmall = offset ?? 0;
        }

        if (offsetSumForSlideSmall >= SECTION_AMOUNT_SMALL) {
            slideOfArtListSmall.push(
                <ArtGallerySlideSmall key={index} artGalleryList={artsDataSmall} />,
            );
            artsDataSmall = [];
            offsetSumForSlideSmall = 0;
        }
    });

    if (!Number.isInteger(offsetSumSmall / SECTION_AMOUNT_SMALL)) {
        slideOfArtListSmall.push(
            <ArtGallerySlideSmall key={artsDataSmall.length} artGalleryList={artsDataSmall} />,
        );
    }

    const sliderProps = {
        className: 'artGallerySliderContainer',
        infinite: false,
        touchAction: 'pan-y',
        touchThreshold: 25,
        transform: 'translateZ(0)',
        swipeOnClick: false,
        slidesToShow: windowsize.width >= 768 ? 1 : windowsize.width >= 480 ? 1 : undefined,
        slidesToScroll: windowsize.width >= 768 ? 1 : windowsize.width >= 480 ? 1 : 3,
        centerPadding: '0px',
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
        touchThreshold: 25,
        transform: 'translateZ(0)',
    };

    return (
        <div
            id="art-gallery"
            className={`artGalleryWrapper 
            ${getStreetcodeArtArray.length ? '' : 'display-none'}`}
        >
            <div className="artGalleryContainer container">
                <BlockHeading headingText="Арт-галерея" />
                <div className="artGalleryContentContainer">
                    <div className="artGallerySliderContainer">
                        {windowsize.width >= 1025 && (
                            <SlickSlider
                                {...sliderProps}
                            >
                                {slideOfArtList}
                            </SlickSlider>
                        )}
                        {windowsize.width <= 1024 && (
                            <SlickSlider

                                {...sliderPropsSmall}
                            >
                                {slideOfArtListSmall}
                            </SlickSlider>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(ArtGalleryBlock);
