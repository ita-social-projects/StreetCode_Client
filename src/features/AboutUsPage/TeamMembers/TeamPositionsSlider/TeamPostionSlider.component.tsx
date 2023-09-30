import { useState } from 'react';
import LeftSliderArrow from '@assets/images/utils/LeftDefaultSliderArrow.svg';
import RightSliderArrow from '@assets/images/utils/RightDefaultSliderArrow.svg';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Positions } from '@/models/team/team.model';

interface Props {
    positions: Positions[],
    setActive: React.Dispatch<React.SetStateAction<number>>,
}

const SliderComponents = ({ positions, setActive }: Props) => {
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

    const getActive = (swiper) => {
        const { realIndex } = swiper;
        const activePosition = positions[realIndex];
        const activePositionId = activePosition.id;
        setActive(activePositionId);
    };

    return (
        <div className="topSliderContainer">
            <LeftSliderArrow className="slider-arrow" alt="Previous" onClick={handlePreviousSlide} />
            <div className="topSlider">
                <Swiper
                    slidesPerView={5}
                    centeredSlides
                    loop
                    onSwiper={(swiper) => setSwiper(swiper)}
                    onSlideChange={(swiper) => getActive(swiper)}
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
                    {positions.map((position) => (
                        <SwiperSlide className="square" key={position.id}>
                            <div key={position.position}>
                                <div>{position.position}</div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <RightSliderArrow className="slider-arrow" alt="Next" onClick={handleNextSlide} />
        </div>
    );
};
export default SliderComponents;
