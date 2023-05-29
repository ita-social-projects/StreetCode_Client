import './SlickSlider.styles.scss';

import {
    FC, memo, useCallback, useRef, useState,
} from 'react';
import Slider from 'react-slick';

import useMobx, { useModalContext } from '@/app/stores/root-store';

import SliderProps, { defaultSliderProps } from './index';

const GenericSlider: FC<SliderProps> = ({
    children,
    onClick,
    swipeOnClick = false,
    ...sliderProps
}) => {
    const { modalStore: { setModal } } = useModalContext();
    const sliderRef = useRef<Slider>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lastClick, setLastClick] = useState(Date.now());

    const isOnRightEdge = (
        currentIndx : number,
        slideToIndex : number,
    ) => (currentIndx === children.length - 1 && slideToIndex === 0);

    const isOnLeftEdge = (
        currentIndx : number,
        slideToIndex : number,
    ) => (currentIndx === 0 && slideToIndex === children.length - 1);

    const move = useCallback(
        (direction: 'next' | 'prev', slideToIndex: number) => {
            if (slideToIndex === currentIndex) {
                const factId = children[currentIndex].props.fact.id;
                setModal('facts', factId, true);
                return;
            }

            if (Date.now() - lastClick >= sliderProps.speed + 100) {
                if (direction === 'next') {
                    sliderRef.current?.slickNext();
                } else {
                    sliderRef.current?.slickPrev();
                }
                setCurrentIndex(slideToIndex);
                setLastClick(Date.now());
            }
        },
        [lastClick, setCurrentIndex, setLastClick, sliderProps.speed, currentIndex, children.length],
    );

    return (
        <div className="sliderClass">
            <Slider
                ref={sliderRef}
                {...sliderProps}
                beforeChange={(currentSlide, nextSlide) => setCurrentIndex(nextSlide)} // for handle dots click
                className={!sliderProps.infinite ? 'nonInfiniteSlider' : ''}
            >
                {
                    children?.map((slide, slideToIndex) => {
                        if (!isOnRightEdge(currentIndex, slideToIndex)
                            && (slideToIndex < currentIndex || isOnLeftEdge(currentIndex, slideToIndex))) {
                            return (
                                <div
                                    key={slideToIndex}
                                    onClick={() => move('prev', slideToIndex)}
                                >
                                    {slide}
                                </div>
                            );
                        }
                        if (slideToIndex >= currentIndex || isOnRightEdge(currentIndex, slideToIndex)) {
                            return (
                                <div
                                    key={slideToIndex}
                                    onClick={() => move('next', slideToIndex)}
                                >
                                    {slide}
                                </div>
                            );
                        }
                        return (<div />);
                    })
                }
            </Slider>
        </div>
    );
};

GenericSlider.defaultProps = defaultSliderProps;

export default memo(GenericSlider);
