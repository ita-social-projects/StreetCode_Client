import './TeamMembers.component.scss';

import { useEffect, useState } from 'react';
import LeftSliderArrow from '@assets/images/utils/LeftDefaultSliderArrow.svg';
import RightSliderArrow from '@assets/images/utils/RightDefaultSliderArrow.svg';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import PositionsApi from '@/app/api/team/positions.api';
import TeamApi from '@/app/api/team/team.api';
import { SCREEN_SIZES } from '@/app/common/constants/screen-sizes.constants';
import TeamMember, { Positions } from '@/models/team/team.model';

import 'swiper/swiper-bundle.min.css';
import 'swiper/css/pagination';
import 'swiper/css';

import TeamMemberCard from '../TeamMemberCard/TeamMemberCard.component';

import TeamMemberList from './TeamMembersList/TeamMemberList.component';

const TeamMembers = () => {
    const [positions, setPositions] = useState<Positions[]>([]);

    const [team, setTeam] = useState<TeamMember[]>([]);

    useEffect(
        () => {
            TeamApi.getByRoleId(1).then(
                (result) => setTeam(result),
            ).then();
        },
        [],
    );

    useEffect(() => {
        PositionsApi.getAll().then((pos) => {
            setPositions(pos);
        });
    }, []);

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

    const sliderItems = positions.map((position, index) => (
        <div key={index}>
            <div>{position.position}</div>
        </div>
    ));

    const getSliderData = () => {
        if (team.length > 0) {
            return (
                <Swiper
                    slidesPerView="auto"
                    centeredSlides
                    spaceBetween={20}
                    slideToClickedSlide
                    pagination={window.innerWidth < SCREEN_SIZES.phone}
                    loop
                >
                    {team.map(
                        (member) => (
                            <SwiperSlide>
                                <TeamMemberCard {...member} />
                            </SwiperSlide>
                        ),
                    )}
                </Swiper>
            );
        }
        return (<></>);
    };

    return (
        <div className="aboutUsBlockContainer">
            <div className="topSliderContainer">
                <LeftSliderArrow className="slider-arrow" alt="Previous" onClick={() => handlePreviousSlide()} />
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
                <RightSliderArrow className="slider-arrow" alt="Next" onClick={() => handleNextSlide()} />
            </div>
            { window.innerWidth <= SCREEN_SIZES.tablet
                ? (
                    <div className="teamMembersSlider">
                        {
                            getSliderData()
                        }
                    </div>
                )
                : <TeamMemberList teamMembers={team} />}
        </div>
    );
};
export default TeamMembers;
