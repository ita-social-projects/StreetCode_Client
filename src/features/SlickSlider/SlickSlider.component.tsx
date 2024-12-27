import './SlickSlider.styles.scss';

import { FC, memo, useCallback, useEffect, useRef } from 'react';
import Slider from 'react-slick';

import SliderProps, { defaultSliderProps } from './index';

import classNames from 'classnames'
const GenericSlider: FC<SliderProps> = ({
    children,
    onClick,
    swipeOnClick,
    secondPreset=false,
    initialSlide,
    ...sliderProps
}) => {
    const sliderRef = useRef<Slider>(null);

    useEffect(() => {
        console.log("slick go to " + initialSlide);
        sliderRef.current?.slickGoTo(initialSlide ?? 0);
    }, [initialSlide]);

    const handleClick = useCallback((index: number, direction: 'right' | 'left') => {
        if (sliderRef && sliderRef.current && swipeOnClick) {
            if (direction === 'right') {
                sliderRef.current.slickGoTo(index + 1);
            } else {
                sliderRef.current.slickGoTo(index - 1);
            }
        }
        if (onClick) {
            onClick(index);
        }
    }, [onClick, swipeOnClick]);

    const classProps = classNames(
        {'nonInfiniteSlider' : !sliderProps.infinite},
        {'secondPreset' : secondPreset}
    )

    return (
        <div className="sliderClass">
            <Slider 
                ref={sliderRef}
                key={initialSlide} 
                {...sliderProps}
                className={classProps}
            >
                {children?.map((slide, idx) => (
                    <div className="slider-item-container" key={idx}>
                        {swipeOnClick ? (
                            <div
                                className="left"
                                onClick={() => {
                                    handleClick(idx, 'left');
                                }}
                            />
                        ) : <></>}
                        {slide}
                        {swipeOnClick ? (
                            <div
                                className="right"
                                onClick={() => {
                                    handleClick(idx, 'right');
                                }}
                            />
                        ) : <></>}
                    </div>
                ))}
            </Slider>
        </div>
    );
};

GenericSlider.defaultProps = defaultSliderProps;

export default memo(GenericSlider);
