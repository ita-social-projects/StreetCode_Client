import './TeamPositionSlider.styles.scss';

import { useState } from 'react';
import LeftSliderArrow from '@assets/images/utils/LeftDefaultSliderArrow.svg';
import RightSliderArrow from '@assets/images/utils/RightDefaultSliderArrow.svg';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperNew from 'swiper';

import { Positions } from '@/models/team/team.model';

interface Props {
    positions: Positions[],
    setActive: React.Dispatch<React.SetStateAction<number>>,
}

const SliderComponents = ({ positions, setActive }: Props) => {
    const [swiper, setSwiper] = useState< SwiperNew | null >(null);
    const [slidesPerView, setSlidesPerView] = useState(5);
    
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

    const getActive = (swiper : any) => {
        const { realIndex } = swiper;
        const activePosition = positions[realIndex];
        const activePositionId = activePosition.id;
        setActive(activePositionId);
    };

    return (
        <div className="topSliderContainer">
            <LeftSliderArrow className="slider-arrow" onClick={handlePreviousSlide} />
            <div className="topSlider">
                <Swiper
                    slidesPerView={slidesPerView}
                    centeredSlides
                    loop
                    slideToClickedSlide
                    onSwiper={(swiper) => setSwiper(swiper)}
                    onSlideChange={(swiper) => getActive(swiper)}
                    navigation={{ nextEl: '.arrow-left', prevEl: '.arrow-right' }}
                    modules={[Navigation]}
                    breakpoints={{
                        320: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: 3,
                        },
                        1024: {
                            slidesPerView: slidesPerView,
                        },
                    }}
                >
                    {positions.map((position, index) => (
                        <SwiperSlide
                            className="square"
                            key={position.id}
                        >
                            <div key={position.position}>
                                <div className="positionText">{position.position}</div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <RightSliderArrow className="slider-arrow" onClick={handleNextSlide} />
        </div>
    );
};
export default SliderComponents;
