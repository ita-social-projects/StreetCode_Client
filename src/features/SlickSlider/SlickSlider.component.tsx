import "./SlickSlider.styles.scss";

import React, { useEffect, useRef } from 'react';
import Slider, { Settings as SliderProps } from 'react-slick';

interface Props extends SliderProps {
    slides: JSX.Element[];
    onClick?: (index: number) => void;
    toChangeSlidesOnClick?: boolean;
}

const SimpleSlider: React.FC<Props> = (props) => {
    // Code that provides ability to change selected slide after clicking on it
    const sliderRef = useRef<any>(null);

    const handleClick = (index: number) => {
        if (sliderRef && sliderRef.current) {
            sliderRef.current.slickGoTo(index);
        }

        if (props.onClick) {
            props.onClick(index);
        }
    };

    // Code that removes all "slick-cloned" elements if there is only 1 slide
    useEffect(() => {
        if (props.slides.length === 1) {
            const clonedElements = document.querySelectorAll('.interestingFactsSliderContainer .slick-cloned');
            clonedElements.forEach((element) => element.remove());
        }
    }, [props.slides]);

    return (
        <div className="sliderClass">
            <Slider {...props} ref={sliderRef}>
                {props.slides.map((slide, index) => (
                        <div onClick={props.toChangeSlidesOnClick ? () => handleClick(index) : undefined}>
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

export default SimpleSlider;