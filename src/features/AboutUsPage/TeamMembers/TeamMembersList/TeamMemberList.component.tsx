import './TeamMemberList.styles.scss';

import TeamMember from '@/models/team/team.model';

import TeamMemberCard from '../../TeamMemberCard/TeamMemberCard.component';

interface TeamMemberListProps {
    teamMembers: TeamMember[];
}

const TeamMemberList = ({ teamMembers }: TeamMemberListProps) => (
    <div className="teamMemberListContainer">
        {
            teamMembers.map(
                (founder) => (
                    <div
                        key={founder.id}
                        className="teamMemberCardContainer"
                    >
                        <TeamMemberCard
                            key={founder.id}
                            person={founder}
                        />
                    </div>
                ),
            )
        }
    </div>
);

export default TeamMemberList;
