import React from 'react';

import { TeamMemberLinkCreateUpdate } from '@/models/team/team.model';

import LOGO_ICONS from './TeamModal/constants/logoIcons';

const TeamLink: React.FC<{ link: TeamMemberLinkCreateUpdate }> = ({ link }) => {
    const LogoComponent = LOGO_ICONS.find( logo => logo.type === link.logoType)!.icon;

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
