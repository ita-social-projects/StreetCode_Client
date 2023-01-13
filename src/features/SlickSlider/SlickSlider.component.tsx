import './SlickSlider.styles.scss';

import React, { useCallback, useEffect, useRef } from 'react';
import Slider, { Settings as SliderProps } from 'react-slick';

interface Props extends SliderProps {
    slides: JSX.Element[];
    onClick?: (index: number) => void;
    swipeOnClick?: boolean;
}

const SimpleSlider: React.FC<Props> = ({ slides, onClick, swipeOnClick = false, ...sliderProps }) => {
    const sliderRef = useRef<Slider>(null);

    const handleClick = useCallback((index: number) => {
        if (sliderRef && sliderRef.current) {
            sliderRef.current.slickGoTo(index);
        }

        if (onClick) {
            onClick(index);
        }
    }, [onClick]);

    useEffect(() => {
        if (slides.length === 1) {
            const clonedElements = document
                .querySelectorAll('.interestingFactsSliderContainer .slick-cloned');
            clonedElements.forEach((element) => element.remove());
        }
    }, [slides]);

    return (
        <div className="sliderClass">
            <Slider
                {...sliderProps}
                ref={sliderRef}
                className={!sliderProps.infinite ? 'nonInfiniteSlider' : undefined}
            >
                {slides.map((slide, idx) => (
                    <div key={idx} onClick={swipeOnClick ? () => handleClick(idx) : undefined}>
                        {slide}
                    </div>
                ))}
            </Slider>
        </div>
    );
};

const defaultProps: SliderProps = {
    dots: true,
    arrows: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 500,
};
SimpleSlider.defaultProps = defaultProps;

export default React.memo(SimpleSlider);
