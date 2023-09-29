import { Settings as SliderSettings } from 'react-slick';

const SLIDER_PROPS: Partial<SliderSettings> = {
    className: 'artGallerySliderContainer',
    infinite: false,
    arrows: true,
    dots: true,
    draggable: true,
    touchThreshold: 25,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerPadding: '0px',
};

export default SLIDER_PROPS;
