import './InterestingFacts.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BlockSlider from '@features/SlickSlider/InterestingFactSliderSlickSlider.component';
import useMobx, { useStreetcodeDataContext } from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import InterestingFactItem from '@streetcode/InterestingFactsBlock/InterestingFactItem/InterestingFactItem.component';

import ImagesApi from '@/app/api/media/images.api';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import getUrlHash from '@/app/common/utils/getUrlHash.utility';
import { Fact } from '@/models/streetcode/text-contents.model';

const InterestingFactsComponent = () => {
    const { streetcodeStore } = useStreetcodeDataContext();
    const { factsStore } = useMobx();
    const { getStreetCodeId, errorStreetCodeId } = streetcodeStore;
    const [sliderArray, setSliderArray] = useState<Fact[]>([]);
    const [middleFactIndex, setMiddleFactIndex] = useState(0);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    const facts = useRef<Fact[]>([]);
    useAsync(
        () => {
            if (getStreetCodeId !== errorStreetCodeId && getStreetCodeId > 0) {
                factsStore.fetchFactsByStreetcodeId(getStreetCodeId).then(() => {
                    const res = factsStore.getFactArray;
                    facts.current = res;
                    Promise.all(res.map((f, index) => ImagesApi.getById(f.imageId).then((img) => {
                        res[index].image = img;
                    }))).then(() => {
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

    const [searchParams, setSearchParams] = useSearchParams();
    const factID = Number(searchParams.get('factId'));
    let initialSlideIndex = sliderArray.findIndex((fact) => fact.id === factID);
    if (initialSlideIndex === -1) initialSlideIndex = 0;

    useEffect(() => {
        // eslint-disable-next-line no-restricted-globals
        const hash = getUrlHash(location);
        if (!isScrolled && hash === 'wow-facts') {
            const element = document.getElementById(hash);

            setTimeout(() => {
                if (element !== null) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setIsScrolled(true);
                }
            }, 1000);
        }
    });

    const setings = {
        initialSlide: initialSlideIndex,
        dots: facts.current.length > 3,
        swipeOnClick: false,
        touchThreshold: 25,
        rtl: false,
        centerMode: true,
        infinite: sliderArray.length > 1,
        swipe: false,
        centerPadding: '-5px',
        afterChange: (index: number) => {
            const totalFacts = sliderArray.length;
            if (totalFacts > 1) {
                setMiddleFactIndex((index) % totalFacts);
            }
        },
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    centerPadding: '-36px',
                    swipe: true,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    centerPadding: '-30px',
                    swipe: true,
                },
            },
            {
                breakpoint: 1025,
                settings: {
                    centerPadding: '-27.5px',
                    arrows: false,
                    swipe: true,
                },
            },
        ],
    };
    return (
        <div>
            {facts.current.length > 0
                ? (
                    <div
                        id="wow-facts"
                        className={`container "interestingFactsWrapper"
                    ${facts.current.length === 1 ? 'single' : ''}`}
                    >
                        <BlockHeading headingText="Wow-факти" />
                        <div className={`interestingFactsContainer
                    ${facts.current.length === 1 ? 'singleFact' : ''}`}
                        >
                            <div className="interestingFactsSliderContainer">
                                <div style={{ height: '100%' }}>
                                    {(facts.current.length === 1) ? (
                                        <div className="singleSlideContainer">
                                            <InterestingFactItem
                                                fact={facts.current[0]}
                                            />
                                        </div>
                                    ) : (
                                        <BlockSlider
                                            className="heightContainer"
                                            {...setings}
                                        >
                                            {sliderArray.map((fact, index) => (
                                                <InterestingFactItem
                                                    key={fact.id}
                                                    fact={fact}
                                                    index={index}
                                                    middleFactIndex={middleFactIndex}
                                                />
                                            ))}
                                        </BlockSlider>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
                : <></>}
        </div>
    );
};

export default observer(InterestingFactsComponent);
