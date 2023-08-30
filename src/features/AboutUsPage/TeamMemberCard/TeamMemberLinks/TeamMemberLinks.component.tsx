import facebook from '@assets/images/partners/facebook.png';
import instagram from '@assets/images/partners/instagram.png';
import twitter from '@assets/images/partners/twitter.png';
import youtube from '@assets/images/partners/youtube.png';

import { TeamMemberLinkCreateUpdate } from '@/models/team/team.model';

const LogoType = [twitter, instagram, facebook, youtube];

interface Props {
    link:TeamMemberLinkCreateUpdate,
}

const TeamMemberLinks = (link: TeamMemberLinkCreateUpdate) => (
            <a href={link.targetUrl}>
                <img key={link.id}src={LogoType[link.logoType]} />
            </a>
);

export default TeamMemberLinks;