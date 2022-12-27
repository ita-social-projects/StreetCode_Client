import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SlickSlider.styles.css"

import React, {Component, useState} from "react";
import Slider, {Settings as SliderProps} from "react-slick";

const defaultProps: SliderProps = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    lazyLoad: "ondemand",
    centerMode: true,
    autoplay: true,
}

type Props = { slides: JSX.Element[] } & typeof defaultProps;



const SimpleSlider = (props: Props) => {

        return (
            <div style={{width:"100%"}} >
                <Slider {...props}>
                    {props.slides.map(slide =>
                        (
                            <div>{slide}</div>
                        )
                    )}


                </Slider>
            </div>
        );
    }

    export default SimpleSlider

