import './InterestingFacts.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BlockSlider from '@features/SlickSlider/InterestingFactSliderSlickSlider.component';
import Image from '@models/media/image.model';
import useMobx, { useModalContext, useStreecodePageLoaderContext, useStreetcodeDataContext } from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import InterestingFactItem from '@streetcode/InterestingFactsBlock/InterestingFactItem/InterestingFactItem.component';

import ImagesApi from '@/app/api/media/images.api';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import getUrlHash from '@/app/common/utils/getUrlHash.utility';
import { Fact } from '@/models/streetcode/text-contents.model';
import StreetcodeBlock from '@/models/streetcode/streetcode-blocks.model';

const InterestingFactsComponent = () => {
    const { streetcodeStore } = useStreetcodeDataContext();
    const streecodePageLoaderContext = useStreecodePageLoaderContext();
    const { factsStore } = useMobx();
    const { getStreetCodeId, errorStreetCodeId } = streetcodeStore;
    const [sliderArray, setSliderArray] = useState<Fact[]>([]);
    const [middleFactIndex, setMiddleFactIndex] = useState(0);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const { modalStore: { setModal } } = useModalContext();

    const facts = useRef<Fact[]>([]);

    useAsync(async () => {
        if (getStreetCodeId !== errorStreetCodeId && getStreetCodeId > 0) {
            await factsStore.fetchFactsByStreetcodeId(getStreetCodeId);
            const res = factsStore.getFactArray;
            facts.current = res;

            const uniqueImages = new Map<number, Promise<Image>>();
            const fetchedImages = new Set();

            const promises = res.map(async (f) => {
                if (!uniqueImages.has(f.imageId) && !fetchedImages.has(f.imageId)) {
                    fetchedImages.add(f.imageId);
                    const imagePromise = ImagesApi.getById(f.imageId);
                    uniqueImages.set(f.imageId, imagePromise);
                }
            });
            await Promise.all(promises);

            const imageResults = await Promise.all(
                Array.from(uniqueImages.entries())
                    .map(([id, promise]) => promise.then((img) => ({ id, img }))),
            );
            streecodePageLoaderContext.addBlockFetched(StreetcodeBlock.Facts);

            imageResults.forEach(({ id, img }) => {
                res.forEach((fact) => {
                    if (fact.imageId === id) {
                        // eslint-disable-next-line no-param-reassign
                        fact.image = img;
                    }
                });
            });

            setSliderArray(res.length === 2 ? res.concat(res) : res);
        }
    }, [getStreetCodeId]);

    const [searchParams] = useSearchParams();
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
    }, [isScrolled]);

    const handleModalOpen = () =>
    {
        setModal('facts', facts.current[0].id, true);
    };

    const settings = {
        initialSlide: initialSlideIndex,
        dots: facts.current.length > 2,
        swipeOnClick: false,
        touchThreshold: 25,
        rtl: false,
        centerMode: true,
        ...(sliderArray.length === 3 && { slidesToShow: sliderArray.length - 0.01 }),
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
            {facts.current.length > 0 ? (
                <div
                    id="wow-facts"
                    className={'container "interestingFactsWrapper"'}
                >
                    <BlockHeading headingText="Wow-факти" />
                    <div className={`interestingFactsContainer ${facts.current.length === 1 ? 'oneFactContainer' : ''}`}>
                        <div className="interestingFactsSliderContainer">
                            <div
                                style={{ height: '100%' }}
                                className={`${facts.current.length === 3 ? 'slides-3' : ''}`}
                            >
                                {facts.current.length === 1 ? (
                                    <div
                                        className="oneFactItem"
                                        onClick={handleModalOpen}
                                        onKeyDown={handleModalOpen}
                                    >
                                        <InterestingFactItem
                                            fact={facts.current[0]}
                                            middleFactIndex={middleFactIndex}
                                        />
                                    </div>
                                ) : (
                                    <BlockSlider
                                        className="heightContainer"
                                        {...settings}
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
            ) : (
                <></>
            )}
        </div>
    );
};

export default observer(InterestingFactsComponent);
