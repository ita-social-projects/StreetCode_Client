import './InterestingFacts.styles.scss';

import { observer } from 'mobx-react-lite';
import {  useRef, useState } from 'react';
import BlockSlider from '@features/SlickSlider/InterestingFactSliderSlickSlider.component';
import useMobx, { useAdditionalContext, useStreetcodeDataContext } from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import InterestingFactItem from '@streetcode/InterestingFactsBlock/InterestingFactItem/InterestingFactItem.component';

import ImagesApi from '@/app/api/media/images.api';
import FactsApi from '@/app/api/streetcode/text-content/facts.api';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { Fact } from '@/models/streetcode/text-contents.model';

const InterestingFactsComponent = () => {
    const { streetcodeStore } = useStreetcodeDataContext();
    const { factsStore } = useMobx();
    const { imageLoaderStore } = useAdditionalContext();
    const { getStreetCodeId, errorStreetCodeId } = streetcodeStore;
    const [sliderArray, setSliderArray] = useState<Fact[]>([]);
    const facts = useRef<Fact[]>([]);

    console.log("facts render");
    useAsync(
        () => {
            if (getStreetCodeId !== errorStreetCodeId && getStreetCodeId > 0) {
                console.log(facts);
                factsStore.fetchFactsByStreetcodeId(getStreetCodeId).then(() =>{
                    const res = factsStore.getFactArray;
                    Promise.all(res.map((f, index) => ImagesApi.getById(f.imageId).then((img) => {
                        res[index].image = img;
                    }))).then(() => {
                        facts.current = res;
                        setSliderArray(res.length === 3
                            || res.length === 2
                            ? res.concat(res)
                            : res);
                    });
                });
            }
        },
        [getStreetCodeId],
    );

    const setings = {
        dots: sliderArray.length >= 2,
        swipeOnClick: false,
        rtl: false,
        centerMode: true,
        infinite: sliderArray.length > 1,
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
        facts.current.length > 0
            ? (
                <div
                    id="wow-facts"
                    className={`container "interestingFactsWrapper"
                    ${facts.current.length === 1 ? 'single' : ''} 
                    ${facts.current.length ? '' : 'display-none'}`}
                >
                    <BlockHeading headingText="Wow—факти" />
                    <div className={`interestingFactsContainer
                    ${facts.current.length === 1 ? 'singleFact' : ''}`}
                    >
                        <div className="interestingFactsSliderContainer">
                            <div style={{ height: '100%' }}>
                                {(facts.current.length === 1) ? (
                                    <div className="singleSlideContainer">
                                        <InterestingFactItem
                                            numberOfSlides={1}
                                            fact={facts.current[0]}
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
                                                handleImageLoad={imageLoaderStore.handleImageLoad}
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

export default observer(InterestingFactsComponent);
