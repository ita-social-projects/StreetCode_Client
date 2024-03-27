import React from 'react';
import behance from '@assets/images/partners/behance.svg';
import facebook from '@assets/images/partners/facebook.svg';
import http from '@assets/images/partners/http.svg';
import instagram from '@assets/images/partners/instagram.svg';
import linkedin from '@assets/images/partners/linkedin.svg';
import tiktok from '@assets/images/partners/tiktok.svg';
import twitter from '@assets/images/partners/twitterNew.svg';
import youtube from '@assets/images/partners/youtube.svg';

import { TeamMemberLinkCreateUpdate } from '@/models/team/team.model';

const LogoType = [twitter, instagram, facebook, youtube, linkedin, tiktok, behance, http];
const TeamLink: React.FC<{ link: TeamMemberLinkCreateUpdate }> = ({ link }) => {
    const LogoComponent = LogoType[link.logoType];

    return (
        <a
            rel="noreferrer"
            target="_blank"
            className="sourceLink"
            href={link.targetUrl}
        >
            <LogoComponent />
        </a>
    );
};
export default TeamLink;
