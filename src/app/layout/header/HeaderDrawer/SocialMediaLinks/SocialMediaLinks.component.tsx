import './SocialMediaLinks.styles.scss';

import FaceBook from '@images/header-drawer/Facebook.png';
import Instagram from '@images/header-drawer/Instagram.png';
import TikTok from '@images/header-drawer/TikTok.png';
import Twitter from '@images/header-drawer/Twitter.png';
import Youtube from '@images/header-drawer/Youtube.png';

const SocialMediaLinks = () => (
    <ul className="socialIconHeaderContainer">
        <li>
            <a href="https://www.facebook.com/streetcodeua" target="_blank" rel="noreferrer">
                <img src={FaceBook} alt="" />
            </a>
        </li>
        <li>
            <a href="https://www.instagram.com/streetcodeua" target="_blank" rel="noreferrer">
                <img src={Instagram} alt="" />
            </a>
        </li>
        <li>
            <a href="https://twitter.com/streetcodeua" target="_blank" rel="noreferrer">
                <img src={Twitter} alt="" />
            </a>
        </li>
        <li>
            <a href="https://www.tiktok.com/@streetcodeua" target="_blank" rel="noreferrer">
                <img src={TikTok} alt="" />
            </a>
        </li>
        <li>
            <a href="https://www.tiktok.com/@streetcodeua" target="_blank" rel="noreferrer">
                <img src={Youtube} alt="" />
            </a>
        </li>
    </ul>
);

export default SocialMediaLinks;
