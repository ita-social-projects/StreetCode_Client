import './SlickSlider.styles.scss';

import { FC, memo, useCallback, useRef } from 'react';
import Slider from 'react-slick';

import SliderProps, { defaultSliderProps } from './index';

const GenericSlider: FC<SliderProps> = ({
    children,
    onClick,
    swipeOnClick = false,
    ...sliderProps
}) => {
    const sliderRef = useRef<Slider>(null);

    const handleClick = useCallback((index: number) => {
        if (sliderRef && sliderRef.current && swipeOnClick) {
            sliderRef.current.slickGoTo(index);
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
                    <div key={idx} onClick={() => handleClick(idx)}>
                        {slide}
                    </div>
                ))}
            </Slider>
        </div>
    );
};

GenericSlider.defaultProps = defaultSliderProps;

export default memo(GenericSlider);
