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

    const moveNext = useCallback((slideToIndex:number) => {
        if (Date.now() - lastClick >= sliderProps.speed + 50) {
            sliderRef.current?.slickNext();
            setCurrentIndex(slideToIndex);
            setLastClick(Date.now());
        }
    });
    const movePrev = useCallback((slideToIndex:number) => {
        if (Date.now() - lastClick >= sliderProps.speed + 50) {
            sliderRef.current?.slickPrev();
            setCurrentIndex(slideToIndex);
            setLastClick(Date.now());
        }
    });
    const isOnRightEdge = (currentIndex : number, slideToIndex : number) => (currentIndex === children.length - 1 && slideToIndex === 0);
    const isOnLeftEdge = (currentIndex : number, slideToIndex : number) => (currentIndex === 0 && slideToIndex === children.length - 1);
    

    return (
        <div className="sliderClass">
            <Slider
                ref={sliderRef}
                {...sliderProps}
                className={!sliderProps.infinite ? 'nonInfiniteSlider' : ''}
            >
                {
                    children?.map((slide, slideToIndex) => {
                        if (!isOnRightEdge(currentIndex, slideToIndex)
                            && (slideToIndex < currentIndex || isOnLeftEdge(currentIndex, slideToIndex))) {
                            return (
                                <div
                                    key={slideToIndex}
                                    onClick={() => movePrev(slideToIndex)}
                                >
                                    {slide}
                                </div>
                            );
                        }
                        if (slideToIndex >= currentIndex || isOnRightEdge(currentIndex, slideToIndex)) {
                            return (
                                <div
                                    key={slideToIndex}
                                    onClick={() => moveNext(slideToIndex)}
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
