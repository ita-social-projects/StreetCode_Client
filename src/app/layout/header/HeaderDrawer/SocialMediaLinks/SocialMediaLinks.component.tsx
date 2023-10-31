import './SocialMediaLinks.styles.scss';

import FaceBook from '@images/header-drawer/Facebook.svg';
import Instagram from '@images/header-drawer/Instagram.svg';
import Telegram from '@images/header-drawer/Telegram.svg';
import TikTok from '@images/header-drawer/TikTok.svg';
import Youtube from '@images/header-drawer/YouTube.svg';

import SOCIAL_MEDIA from '@/app/common/constants/social.constants';

const SocialMediaLinks = () => (
    <ul className="socialIconHeaderContainer">
        <li>
            <a href={SOCIAL_MEDIA.INSTAGRAM} target="_blank" rel="noreferrer">
                <Instagram />
            </a>
        </li>
        <li>
            <a href={SOCIAL_MEDIA.FACEBOOK} target="_blank" rel="noreferrer">
                <FaceBook />
            </a>
        </li>
        <li>
            <a href={SOCIAL_MEDIA.TIKTOK} target="_blank" rel="noreferrer">
                <TikTok />
            </a>
        </li>
        <li>
            <a href={SOCIAL_MEDIA.TELEGRAM} target="_blank" rel="noreferrer">
                <Telegram />
            </a>
        </li>
        <li>
            <a href={SOCIAL_MEDIA.YOUTUBE} target="_blank" rel="noreferrer">
                <Youtube />
            </a>
        </li>
    </ul>
);

export default SocialMediaLinks;
