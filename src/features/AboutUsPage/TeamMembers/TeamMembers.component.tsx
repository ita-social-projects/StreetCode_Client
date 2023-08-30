import './TeamMembers.component.scss';

import React, { useEffect, useState } from 'react';
import LeftSliderArrow from '@assets/images/utils/LeftDefaultSliderArrow.svg';
import RightSliderArrow from '@assets/images/utils/RightDefaultSliderArrow.svg';
import SwiperCore, {
    A11y,
    EffectFade,
    Navigation,
    Pagination,
    Scrollbar,
} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import TeamApi from '@/app/api/team/team.api';
import Picture from '@/assets/images/about-us/pictureWithBg2.png';
import TeamMember from '@/models/team/team.model';

import 'swiper/swiper-bundle.min.css';
import 'swiper/css/pagination';
import 'swiper/css';

import TeamMemberList from './TeamMembersList/TeamMemberList.component';

const TeamMembers = () => {
    const teamMemberRoles1: TeamMember[] = [
        {
            id: 0,
            isMain: false,
            name: 'Roman',
            description: 'Description',
            imageId: 1,
            image: {
                id: 1,
                blobName: 'hueta',
                mimeType: 'popa',
                base64: Picture,
            },
            teamMemberLinks: [],
            positions: [],
        },
    ];

    const [team, setTeam] = useState<TeamMember[]>([]);
    useEffect(
        () => {
            TeamApi.getByRoleId(1).then(
                (result) => setTeam(result),
            );
        },
        [],
    );

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

    const stringsArray: string[] = ['розробники', 'Історики', 'Керівники напрямів', 'Адміністратори', 'Засновники'];

    const sliderItems = stringsArray.map((string, index) => (
        <div>
            <div>{string}</div>
        </div>
    ));

    return (
        <div className="aboutUsBlockContainer">
            <h1>
                <div />
                <text>тут буде слайдер</text>
                <div />
            </h1>
            <div className="topSliderContainer">
                <LeftSliderArrow className="slider-arrow" alt="Previous" onClick={() => handlePreviousSlide()} />
                <div className="topSlider">
                    <Swiper
                        className='squareParent'
                        onSwiper={(swiper) => setSwiper(swiper)}
                        slidesPerView={5}
                        spaceBetween={30}
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
                            <SwiperSlide className='square' key={index}>{item}</SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <RightSliderArrow className="slider-arrow" alt="Next" onClick={() => handleNextSlide()} />
            </div>
            <TeamMemberList teamMembers={team} />
        </div>
    );
};
export default TeamMembers;
