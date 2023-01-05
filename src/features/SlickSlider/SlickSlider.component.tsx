import './SlickSlider.styles.scss';

import { FC } from 'react';
import Slider, { Settings as SliderProps } from 'react-slick';

interface Props extends SliderProps {
    slides: JSX.Element[]
}

const SimpleSlider: FC<Props> = (props) => (
  <div className="sliderClass">
    <Slider {...props}>
      {props.slides.map((slide) => (
        <div>{slide}</div>
            ))}
    </Slider>
  </div>
);

const defaultProps: SliderProps = {
    dots: true,
    arrows: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 5e2,
};
SimpleSlider.defaultProps = defaultProps;

export default SimpleSlider;
