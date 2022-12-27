import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, {Component, useState} from "react";
import Slider, {Settings as SliderProps} from "react-slick";

interface Props extends SliderProps{
    slides: JSX.Element[];
}


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

