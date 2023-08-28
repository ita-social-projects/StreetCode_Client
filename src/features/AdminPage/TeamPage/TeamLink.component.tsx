import React from 'react';
import behance from '@assets/images/partners/behance.png';
import facebook from '@assets/images/partners/facebook.png';
import https from '@assets/images/partners/https.png';
import instagram from '@assets/images/partners/instagram.png';
import linkedin from '@assets/images/partners/linkedin.png';
import tiktok from '@assets/images/partners/tiktok.png';
import twitter from '@assets/images/partners/twitter.png';
import youtube from '@assets/images/partners/youtube.png';

import { TeamMemberLinkCreateUpdate } from '@/models/team/team.model';

const LogoType = [twitter, instagram, facebook, youtube, linkedin, tiktok, behance, https];
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
