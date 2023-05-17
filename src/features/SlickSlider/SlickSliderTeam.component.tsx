import './SlickSlider.styles.scss';

import { FC, memo, useCallback, useRef } from 'react';
import Slider from 'react-slick';

import SliderProps, { defaultSliderProps } from './index';

const TeamSlider: FC<SliderProps> = ({
    children,
    onClick,
    swipeOnClick,
    ...sliderProps
}) => {
    const sliderRef = useRef<Slider>(null);


    return (
        <div className="sliderClass">
            <Slider
                ref={sliderRef}
                {...sliderProps}
                className={!sliderProps.infinite ? 'nonInfiniteSlider' : ''}
            >
                {children?.map((slide, idx) => (
                    <div onClick={() => sliderRef.current?.slickGoTo(idx)} className="slider-item-container" key={idx}>
                        {slide}
                    </div>
                ))}
            </Slider>
        </div>
    );
};

TeamSlider.defaultProps = defaultSliderProps;

export default memo(TeamSlider);
