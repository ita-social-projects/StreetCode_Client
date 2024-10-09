import './SlickSlider.styles.scss';

import { FC, memo, useCallback, useRef } from 'react';
import Slider from 'react-slick';

import SliderProps, { defaultSliderProps } from './index';

import classNames from 'classnames'
const GenericSlider: FC<SliderProps> = ({
    children,
    onClick,
    swipeOnClick,
    secondPreset=false,
    ...sliderProps
}) => {
    const sliderRef = useRef<Slider>(null);
    sliderRef.current?.slickGoTo(0); //Does anybody see issue with this?
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
