import { Settings as SliderSettings } from 'react-slick';

type SliderWithoutChildren = Omit<SliderSettings, 'children'>;

export default interface SliderProps extends SliderWithoutChildren {
    onClick?: (index: number) => void;
    swipeOnClick?: boolean;
    children: JSX.Element[];
}

export const defaultSliderProps: SliderWithoutChildren = {
    dots: true,
    arrows: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 500,
    waitForAnimate: true,
};
