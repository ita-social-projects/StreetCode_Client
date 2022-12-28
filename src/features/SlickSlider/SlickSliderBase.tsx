import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./SlickSlider.styles.css"
import Slider, { Settings as SliderProps } from "react-slick"
import { FC } from "react";

const defaultProps: SliderProps = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    lazyLoad: "ondemand",
    centerMode: true,
}

interface Props extends SliderProps {
    slides: JSX.Element[]
}

const SimpleSlider: FC<Props> = (props: Props) => (
    <div style={{width: "100%"}}>
        <Slider {...props}>
            {props.slides.map(slide => (
                <div className={'sdg'}>{slide}</div>
            ))}
        </Slider>
    </div>
)

// SimpleSlider.defaultProps = defaultProps
export default SimpleSlider

