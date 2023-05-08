import './InterestingFacts.styles.scss';

import { observer } from 'mobx-react-lite';
import { SetStateAction, useEffect, useState } from 'react';
import BlockSlider from '@features/SlickSlider/InterestingFactSliderSlickSlider.component';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import InterestingFactItem from '@streetcode/InterestingFactsBlock/InterestingFactItem/InterestingFactItem.component';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import useImageLoader from '@/app/common/hooks/stateful/useImageLoading';

interface Props {
    setInterestingFactsState: React.Dispatch<React.SetStateAction<boolean>>;
}

const InterestingFactsComponent = ({ setInterestingFactsState }:Props) => {
    const { factsStore: { fetchFactsByStreetcodeId, getFactArray }, streetcodeStore } = useMobx();
    const { getStreetCodeId, errorStreetCodeId } = streetcodeStore;
    const [loadedImagesCount, handleImageLoad] = useImageLoader();

    useAsync(
        () => {
            if (getStreetCodeId !== errorStreetCodeId) {
                fetchFactsByStreetcodeId(getStreetCodeId);
            }
        },
        [getStreetCodeId],
    );
    const sliderArray = getFactArray.length === 3 || getFactArray.length === 2 ? getFactArray.concat(getFactArray) : getFactArray;

    const setings = {
        dots: getFactArray.length > 3,
        swipeOnClick: false,
        rtl: false,
        centerMode: true,
        slidesToShow: 3,
        swipe: false,
        centerPadding: '-5px',
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    centerPadding: '-36px',
                    swipe: true,
                    dots: true,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    centerPadding: '-30px',
                    swipe: true,
                    dots: true,
                },
            },
            {
                breakpoint: 1025,
                settings: {
                    centerPadding: '-27.5px',
                    centerlMode: true,
                    arrows: false,
                    swipe: true,
                    dots: true,
                },
            },

        ],
    };

    useEffect(() => {
        if ((loadedImagesCount === 1 && getFactArray.length === 1)
            || (loadedImagesCount === sliderArray.length && loadedImagesCount !== 0)) {
            setInterestingFactsState(true);
        }
    }, [loadedImagesCount]);

    return (
        <div
            id="wow-facts"
            className={`interestingFactsWrapper 
            ${getFactArray.length === 1 ? 'single' : ''} 
            ${getFactArray.length ? '' : 'display-none'}`}
        >
            <div className="interestingFactsContainer">
                <BlockHeading headingText="Wow—факти" />
                <div className="interestingFactsSliderContainer">
                    <div style={{ height: '100%' }}>
                        {(getFactArray.length === 1) ? (
                            <div className="singleSlideContainer">
                                <InterestingFactItem
                                    numberOfSlides={1}
                                    fact={getFactArray[0]}
                                    handleImageLoad={handleImageLoad}
                                />
                            </div>
                        ) : (
                            <BlockSlider
                                className="heightContainer"
                                {...setings}
                            >
                                {sliderArray.map((fact) => (
                                    <InterestingFactItem
                                        key={fact.id}
                                        fact={fact}
                                        numberOfSlides={sliderArray.length}
                                        handleImageLoad={handleImageLoad}
                                    />
                                ))}
                            </BlockSlider>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(InterestingFactsComponent);
