import { useState } from 'react';
import LeftSliderArrow from '@assets/images/utils/LeftDefaultSliderArrow.svg';
import RightSliderArrow from '@assets/images/utils/RightDefaultSliderArrow.svg';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

const SliderComponents = ({ sliderItems }) => {
    const [swiper, setSwiper] = useState(null);

    const handlePreviousSlide = () => {
        if (swiper) {
            swiper.slidePrev();
        }
    };

    const handleNextSlide = () => {
        if (swiper) {
            swiper.slideNext();
        }
    };

    return (
        <div className="topSliderContainer">
            <LeftSliderArrow className="slider-arrow" alt="Previous" onClick={handlePreviousSlide} />
            <div className="topSlider">
                <Swiper
                    className="squareParent"
                    onSwiper={(swiper) => setSwiper(swiper)}
                    slidesPerView={5}
                    spaceBetween={0}
                    centeredSlides
                    loop
                    navigation={{ nextEl: '.arrow-left', prevEl: '.arrow-right' }}
                    modules={[Navigation]}
                    breakpoints={{
                        360: {
                            slidesPerView: 1,
                        },
                        425: {
                            slidesPerView: 3,
                        },
                        768: {
                            slidesPerView: 5,
                        },
                    }}
                >
                    {sliderItems.map((item, index) => (
                        <SwiperSlide className="square" key={index}>{item}</SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <RightSliderArrow className="slider-arrow" alt="Next" onClick={handleNextSlide} />
        </div>
    );
};
export default SliderComponents;
