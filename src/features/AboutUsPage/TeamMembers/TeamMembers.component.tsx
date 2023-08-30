import './TeamMembers.component.scss';

import { useEffect, useState } from 'react';

import PositionsApi from '@/app/api/team/positions.api';
import TeamApi from '@/app/api/team/team.api';
import { SCREEN_SIZES } from '@/app/common/constants/screen-sizes.constants';
import TeamMember, { Positions } from '@/models/team/team.model';

import 'swiper/swiper-bundle.min.css';
import 'swiper/css/pagination';
import 'swiper/css';

import TeamMemberCard from '../TeamMemberCard/TeamMemberCard.component';

import TeamMemberList from './TeamMembersList/TeamMemberList.component';
import TeamMemberSlider from './TeamPositionsSlider/TeamMembersSlider.component';
import SliderComponents from './TeamPositionsSlider/TeamPostionSlider.component';

const TeamMembers = () => {
    const [positions, setPositions] = useState<Positions[]>([]);

    const [team, setTeam] = useState<TeamMember[]>([]);
    const [positionId, setPositionId] = useState<number>(-1);

    useEffect(
        () => {
            if (positionId > 0) {
                TeamApi.getByRoleId(positionId).then(
                    (result) => setTeam(result),
                );
            }
        },
        [positionId],
    );

    useEffect(() => {
        PositionsApi.getAll().then((pos) => {
            setPositions(pos);
        });
    }, []);

    const sliderItems = positions.map((position, index) => (
        <div key={index}>
            <div>{position.position}</div>
        </div>
    ));

    return (
        <div className="aboutUsBlockContainer">
            <SliderComponents
                sliderItems={sliderItems}
            />
            {window.innerWidth <= SCREEN_SIZES.tablet ? (
                <TeamMemberSlider team={team} />
            ) : (
                <TeamMemberList teamMembers={team} />
            )}
        </div>
    );
};
export default TeamMembers;
