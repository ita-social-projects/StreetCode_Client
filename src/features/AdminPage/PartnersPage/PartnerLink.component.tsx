import React from 'react';
import { Link } from 'react-router-dom';
import facebook from '@assets/images/partners/facebook.svg';
import instagram from '@assets/images/partners/instagram.svg';
import twitter from '@assets/images/partners/twitterNew.svg';
import youtube from '@assets/images/partners/youtube.svg';

import { PartnerSourceLinkCreateUpdate } from '@/models/partners/partners.model';

const logoCollection = [twitter, instagram, facebook, youtube];
const PartnerLink: React.FC<{ link: PartnerSourceLinkCreateUpdate }> = ({ link }) => {
    const { logoType, targetUrl } = link;

    const LogoComponent = logoCollection[logoType];

    return (
        <Link to={targetUrl}>
            <LogoComponent />
        </Link>
    );
};

export default PartnerLink;
