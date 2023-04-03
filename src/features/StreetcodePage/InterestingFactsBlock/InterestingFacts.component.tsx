import './InterestingFacts.styles.scss';

import { observer } from 'mobx-react-lite';
import BlockSlider from '@features/SlickSlider/InterestingFactSliderSlickSlider.component';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import InterestingFactItem from '@streetcode/InterestingFactsBlock/InterestingFactItem/InterestingFactItem.component';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';

const InterestingFactsComponent = () => {
    const { streetcodeStore, factsStore } = useMobx();
    const { getStreetCodeId } = streetcodeStore;
    const { fetchFactsByStreetcodeId, getFactArray } = factsStore;

    useAsync(async () => {
        fetchFactsByStreetcodeId(getStreetCodeId);
    }, [getStreetCodeId, streetcodeStore]);

    const sliderArray = getFactArray.length === 3
    || getFactArray.length === 2 ? getFactArray.concat(getFactArray) : getFactArray;
    const blockToUpdateMargin = document.querySelector('.interestingFactsWrapper') as HTMLElement;
    getFactArray.length === 1 ? blockToUpdateMargin.style.marginBottom = '200px' : null;

    return (
        <div className="interestingFactsWrapper">
            <div className="interestingFactsContainer">
                <BlockHeading headingText="Wow-факти" />
                <div className="interestingFactsSliderContainer">
                    <div style={{ height: '100%' }}>
                        {(getFactArray.length === 1) ? (
                            <div className="singleSlideContainer">
                                <InterestingFactItem
                                    numberOfSlides={1}
                                    fact={getFactArray[0]}
                                />
                            </div>
                        ) : (
                            <BlockSlider
                                dots={getFactArray.length > 3}
                                className="heightContainer"
                                swipeOnClick
                                swipe={false}
                                centerMode
                                centerPadding="-12px"
                            >
                                {sliderArray.map((fact) => (
                                    <InterestingFactItem
                                        key={fact.id}
                                        fact={fact}
                                        numberOfSlides={sliderArray.length}
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
