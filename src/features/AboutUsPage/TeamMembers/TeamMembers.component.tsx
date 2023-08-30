import './TeamMembers.component.scss';

import React, { useEffect, useState } from 'react';
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

    const stringsArray: string[] = ['розробники', 'Історики', 'Керівники напрямів', 'Адміністратори', 'Засновники'];

    const sliderItems = stringsArray.map((string, index) => (
        <React.Fragment key={index}>
            <div>{string}</div>
            <div className="square" />
        </React.Fragment>
    ));

    return (
        <div className="aboutUsBlockContainer">
            <h1>
                <div />
                <text>тут буде слайдер</text>
                <div />
            </h1>
            <div className="topSliderContainer">
                <div className="topSlider">
                    <button className="arrow-right arrow">Prev</button>
                    <Swiper
                        slidesPerView={5}
                        spaceBetween={30}
                        centeredSlides
                        loop
                        navigation={{ nextEl: '.arrow-left', prevEl: '.arrow-right' }}
                        modules={[Navigation]}
                    >
                        {stringsArray.map((item, index) => (
                            <SwiperSlide key={index}>{item}</SwiperSlide>
                        ))}
                    </Swiper>
                    <button className="arrow-left arrow">Next</button>
                </div>
            </div>
            <TeamMemberList teamMembers={team} />
        </div>
    );
};
export default TeamMembers;
