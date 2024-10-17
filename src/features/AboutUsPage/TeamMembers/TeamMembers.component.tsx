import './TeamMembers.component.scss';

import { useEffect, useState } from 'react';

import PositionsApi from '@/app/api/team/teampositions.api';
import TeamApi from '@/app/api/team/team.api';
import { SCREEN_SIZES } from '@/app/common/constants/screen-sizes.constants';
import TeamMember, { Positions } from '@/models/team/team.model';

import 'swiper/swiper-bundle.min.css';
import 'swiper/css/pagination';
import 'swiper/css';

import TeamMemberList from './TeamMembersList/TeamMemberList.component';
import TeamMemberSlider from './TeamPositionsSlider/TeamMembersSlider.component';
import SliderComponents from './TeamPositionsSlider/TeamPostionSlider.component';

const TeamMembers = () => {
    const [positions, setPositions] = useState<Positions[]>([]);

    const [team, setTeam] = useState<TeamMember[]>([]);
    const [positionId, setPositionId] = useState<number>(-1);
    const [allTeams, setAllTeams] = useState<Map<number, TeamMember[]>>();
    useEffect(() => {
        if (positionId > 0) {
            const fetchedTeam = allTeams?.get(positionId);
            if (!fetchedTeam) {
                TeamApi.getByRoleId(positionId).then(
                    (result) => {
                        setTeam(result);
                        setAllTeams((prevState) => new Map(prevState).set(positionId, result));
                    },
                );
            } else {
                setTeam(fetchedTeam);
            }
        }
    }, [positionId]);

    useEffect(() => {
        PositionsApi.getAllWithTeamMembers().then((pos) => {
            setPositions(pos);
            if (pos.length > 0) {
                setPositionId(pos[0].id);
            }
        });
    }, []);

    return (
        positions.length
            ? (
                <div className="aboutUsBlockContainer">
                    <SliderComponents
                        positions={positions}
                        setActive={setPositionId}
                    />
                    {window.innerWidth <= SCREEN_SIZES.tablet ? (
                        <TeamMemberSlider team={team} />
                    ) : (
                        <TeamMemberList teamMembers={team} />
                    )}
                </div>
            )
            : null
    );
};
export default TeamMembers;
