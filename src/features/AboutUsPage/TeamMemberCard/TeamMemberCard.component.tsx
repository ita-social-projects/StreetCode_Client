import './TeamMemberCard.styles.scss';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import TeamMember from '@/models/team/team.model';

import TeamMemberLinks from './TeamMemberLinks/TeamMemberLinks.component';

type Props = {
    person: TeamMember,
    isSingleCard?: boolean
};

const TeamMemberCard = ({ person, isSingleCard }: Props) => (
    <div className={`cardContainer ${isSingleCard && 'cardContainer_single'}`}>
        <div className="photoContainer">
            <img
                src={person.id > 0
                    ? base64ToUrl(person.image?.base64, person.image?.mimeType)
                    : person.image?.base64}
                alt="team person"
            />
        </div>
        <div className="content">
            <div className="textContainer">
                <h2>{person.name}</h2>
                <p>{person.description}</p>
            </div>

            <div className="linksContainer">
                {person.teamMemberLinks.map(
                    (link) => (
                        <TeamMemberLinks
                            key={link.id}
                            link={link}
                        />
                    ),
                )}
            </div>
        </div>
    </div>
);

export default TeamMemberCard;
