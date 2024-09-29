import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import { SCREEN_SIZES } from '@/app/common/constants/screen-sizes.constants';
import TeamMember from '@/models/team/team.model';

import TeamMemberCard from '../../TeamMemberCard/TeamMemberCard.component';

type TeamMemberSliderProps = {
    team: TeamMember[];
};

const TeamMemberSlider: React.FC<TeamMemberSliderProps> = ({ team }) => {
    const getSliderData = () => {
        if (team.length > 0) {
            return (
                team.length === 1
                    ? <TeamMemberCard person={team[0]} isSingleCard />
                    : (
                        <Swiper
                            slidesPerView="auto"
                            centeredSlides
                            spaceBetween={20}
                            slideToClickedSlide
                            loop
                            pagination={{ clickable: true,  }}
                        >
                            {
                                team.map((member) => (
                                    <SwiperSlide key={member.id}>
                                        <TeamMemberCard person={member} />
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    )
            );
        }
        return <></>;
    };

    return <div className="teamMembersSlider">{getSliderData()}</div>;
};

export default TeamMemberSlider;
