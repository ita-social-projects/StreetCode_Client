import './TeamMemberCard.styles.scss'
import TeamMember from '@/models/team/team.model';
import TeamMemberLinks from './TeamMemberLinks/TeamMemberLinks.component';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

const TeamMemberCard = (member : TeamMember) => (
    <div className='cardContainer'>
        <div className='photoContainer'>
            <img src = { member.id > 0 ? base64ToUrl(member.image?.base64, member.image?.mimeType) : member.image?.base64}/>
        </div>
        <div className='textContainer'>
            <h2>{member.name}</h2>
            <p>{member.description}</p>
            <div className='linksContainer'>
                {member.teamMemberLinks.map(
                    (link)=>(
                        <TeamMemberLinks {...link}/>
                    )
                )}
            </div>
        </div>
    </div>
);

export default TeamMemberCard