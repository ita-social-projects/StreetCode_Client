import './SlickSlider.styles.scss';

import { FC, memo, useCallback, useRef } from 'react';
import Slider from 'react-slick';

import SliderProps, { defaultSliderProps } from './index';

const GenericSlider: FC<SliderProps> = ({
    children,
    onClick,
    swipeOnClick,
    ...sliderProps
}) => {
    const sliderRef = useRef<Slider>(null);

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

    return (
        <div className="sliderClass">
            <Slider
                ref={sliderRef}
                {...sliderProps}
                className={!sliderProps.infinite ? 'nonInfiniteSlider' : ''}
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