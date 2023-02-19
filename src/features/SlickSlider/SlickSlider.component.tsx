import './SlickSlider.styles.scss';

import { FC, memo, useCallback, useRef, useState } from 'react';
import Slider from 'react-slick';

import SliderProps, { defaultSliderProps } from './index';

const GenericSlider: FC<SliderProps> = ({
    children,
    onClick,
    swipeOnClick = false,
    ...sliderProps
}) => {
    const sliderRef = useRef<Slider>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lastClick, setLastClick] = useState(Date.now());

    const moveNext = useCallback((idx:number) => {
        if (Date.now() - lastClick >= sliderProps.speed + 50) {
            sliderRef.current?.slickNext();
            setCurrentIndex(idx);
            setLastClick(Date.now());
        }
    });
    const movePrev = useCallback((idx:number) => {
        if (Date.now() - lastClick >= sliderProps.speed + 50) {
            sliderRef.current?.slickPrev();
            setCurrentIndex(idx);
            setLastClick(Date.now());
        }
    });
    const isOnLeftEdge = (currentIndex : number, slideToIndex : number) => (currentIndex === children.length - 1 && slideToIndex === 0);
    const isOnRightEdge = (currentIndex : number, slideToIndex : number) => (currentIndex === 0 && slideToIndex === children.length - 1);

    return (
        <div className="sliderClass">
            <Slider
                ref={sliderRef}
                {...sliderProps}
                className={!sliderProps.infinite ? 'nonInfiniteSlider' : ''}
            >
                {
                    children?.map((slide, idx) => {
                        if (!isOnLeftEdge(currentIndex, idx)
                            && (idx < currentIndex || isOnRightEdge(currentIndex, idx))) {
                            return (
                                <div
                                    key={idx}
                                    onClick={() => movePrev(idx)}
                                >
                                    {slide}
                                </div>
                            );
                        }
                        if (idx >= currentIndex || isOnLeftEdge(currentIndex, idx)) {
                            return (
                                <div
                                    key={idx}
                                    onClick={() => moveNext(idx)}
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
