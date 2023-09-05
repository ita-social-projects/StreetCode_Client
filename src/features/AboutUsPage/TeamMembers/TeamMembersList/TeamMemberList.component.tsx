import TeamMember from "@/models/team/team.model";
import TeamMemberCard from "../../TeamMemberCard/TeamMemberCard.component";
import './TeamMemberList.styles.scss'
interface TeamMemberListProps {
    teamMembers: TeamMember[];
}

const TeamMemberList = (props: TeamMemberListProps) => {
    return (
        <div className="teamMemberListContainer">
            {
                props.teamMembers.map(
                    (founder)=>
                        <div className="teamMemberCardContainer"> 
                            <TeamMemberCard {...founder} />
                        </div>
                )
            }
        </div>
    )
}

export default TeamMemberList;