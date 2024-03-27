import './ContactBlock.styles.scss';

import Email from '@images/contact-us/Email.svg';
import Facebook from '@images/contact-us/Facebook.svg';
import Instagram from '@images/contact-us/Instagram.svg';
import Logo from '@images/contact-us/logo-2.webp';
import Telegram from '@images/contact-us/Telegram.svg';
import TikTok from '@images/contact-us/TikTok.svg';
import Twitter from '@images/contact-us/Twitter.svg';
import YouTube from '@images/contact-us/YouTube.svg';

import { EMAIL_INFO } from '@constants/email.constants';

import SOCIAL_MEDIA from '@/app/common/constants/social.constants';

const ContactBlock = () => (
    <div className="contactBlock">
        <img className="contactLogo" src={Logo} alt="" />
        <div className="contactCover">
            <div className="emailBlock">
                <a href={EMAIL_INFO.WRITE_EMAIL_TO_US} className="emailLink" target="_blank" rel="noreferrer">
                    <div className="icon">
                        <Email />
                    </div>
                </a>
                <span className="email">
                    {EMAIL_INFO.EMAIL}
                </span>
            </div>

            <div className="socials">
                <a href={SOCIAL_MEDIA.FACEBOOK} target="_blank" rel="noreferrer">
                    <div className="icon">
                        <Facebook />
                    </div>
                </a>
                <a href={SOCIAL_MEDIA.INSTAGRAM} target="_blank" rel="noreferrer">
                    <div className="icon">
                        <Instagram />
                    </div>
                </a>
                <a href={SOCIAL_MEDIA.TWITTER} target="_blank" rel="noreferrer">
                    <div className="icon">
                        <Twitter />
                    </div>
                </a>
                <a href={SOCIAL_MEDIA.TIKTOK} target="_blank" rel="noreferrer">
                    <div className="icon">
                        <TikTok />
                    </div>
                </a>
                <a href={SOCIAL_MEDIA.TELEGRAM} target="_blank" rel="noreferrer">
                    <div className="icon">
                        <Telegram />
                    </div>
                </a>
                <a href={SOCIAL_MEDIA.YOUTUBE} target="_blank" rel="noreferrer">
                    <div className="icon">
                        <YouTube />
                    </div>
                </a>
            </div>
        </div>
    </div>
);

export default ContactBlock;
