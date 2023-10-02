import facebook from '@assets/images/partners/facebook.webp';
import instagram from '@assets/images/partners/instagram.webp';
import twitter from '@assets/images/partners/twitter.webp';
import youtube from '@assets/images/partners/youtube.webp';

import { TeamMemberLinkCreateUpdate } from '@/models/team/team.model';

const LogoType = [twitter, instagram, facebook, youtube];
type Props = {
    link: TeamMemberLinkCreateUpdate
};
const TeamMemberLinks = ({ link }: Props) => (
    <a href={link.targetUrl}>
        <img key={link.id} src={LogoType[link.logoType]} alt="social media icon" />
    </a>
);

export default TeamMemberLinks;
