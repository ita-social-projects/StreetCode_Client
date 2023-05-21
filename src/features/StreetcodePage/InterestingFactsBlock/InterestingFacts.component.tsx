import './InterestingFacts.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import BlockSlider from '@features/SlickSlider/InterestingFactSliderSlickSlider.component';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import InterestingFactItem from '@streetcode/InterestingFactsBlock/InterestingFactItem/InterestingFactItem.component';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { Fact } from '@/models/streetcode/text-contents.model';

const InterestingFactsComponent = () => {
    const { imageLoaderStore, factsStore: { fetchFactsByStreetcodeId, getFactArray }, streetcodeStore } = useMobx();
    const { getStreetCodeId, errorStreetCodeId } = streetcodeStore;
    const { handleImageLoad } = imageLoaderStore;

    const [sliderArray, setSliderArray] = useState<Fact[]>([]);
    useAsync(
        () => {
            if (getStreetCodeId !== errorStreetCodeId && getStreetCodeId > 0) {
                Promise.all([
                    fetchFactsByStreetcodeId(getStreetCodeId).then((res) => {
                        console.log(1);
                        setSliderArray(res.length === 3
                            || res.length === 2
                            ? res.concat(res)
                            : res);
                    })]);
            }
        },
        [getStreetCodeId],
    );
    console.log(4);

    useEffect(() => {
        imageLoaderStore.totalImagesToLoad += sliderArray.length;
    }, [getFactArray.length]);

    const setings = {
        dots: getFactArray.length >= 2,
        swipeOnClick: false,
        rtl: false,
        centerMode: true,
        infinite: getFactArray.length > 1,
        swipe: false,
        centerPadding: '-5px',
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    centerPadding: '-36px',
                },
            },
            {
                breakpoint: 768,
                settings: {
                    centerPadding: '-30px',
                },
            },
            {
                breakpoint: 1025,
                settings: {
                    centerPadding: '-27.5px',
                    arrows: false,
                    swipe: true,
                    dots: true,
                },
            },
        ],
    };

    return (
        getFactArray.length > 0
            ? (
                <div
                    id="wow-facts"
                    className={`container "interestingFactsWrapper"
                    ${getFactArray.length === 1 ? 'single' : ''} 
                    ${getFactArray.length ? '' : 'display-none'}`}
                >
                    <BlockHeading headingText="Wow—факти" />
                    <div className={`interestingFactsContainer
                    ${getFactArray.length === 1 ? 'singleFact' : ''}`}
                    >
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
            )
            : <></>
    );
};

export default (InterestingFactsComponent);
