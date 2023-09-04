import React from 'react';
import facebook from '@assets/images/partners/facebook.webp';
import instagram from '@assets/images/partners/instagram.webp';
import twitter from '@assets/images/partners/twitter.webp';
import youtube from '@assets/images/partners/youtube.webp';

import { TeamMemberLinkCreateUpdate } from '@/models/team/team.model';

const LogoType = [twitter, instagram, facebook, youtube];
const TeamLink: React.FC<{ link: TeamMemberLinkCreateUpdate }> = ({ link }) => (
    <a
        rel="noreferrer"
        target="_blank"
        className="sourceLink"
        href={link.targetUrl}
    >
        <img
            key={link.id}
            src={LogoType[link.logoType]}
            alt={link.targetUrl}
        />
    </a>
);
export default TeamLink;
