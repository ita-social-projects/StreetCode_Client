import './ContactBlock.styles.scss';

import Email from '@images/contact-us/email.webp';
import Facebook from '@images/contact-us/Facebook.webp';
import Instagram from '@images/contact-us/Instagram.webp';
import Logo from '@images/contact-us/logo-2.webp';
import TikTok from '@images/contact-us/TikTok.webp';
import Twitter from '@images/contact-us/Twitter.webp';
import YouTube from '@images/contact-us/Youtube.webp';

const EMAIL = 'streetcodeua@gmail.com';

const ContactBlock = () => (
    <div className="contactBlock">
        <img className="contactLogo" src={Logo} alt="" />
        <div className="contactCover">
            <div className="emailBlock">
                <a href={`mailto:${EMAIL}`} className="emailLink">
                    <img className="icon" src={Email} alt="email-logo" />
                </a>
                <span className="email">
                    {EMAIL}
                </span>
            </div>

            <div className="socials">
                <a
                    href="https://www.facebook.com/streetcodeua"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img className="icon" src={Facebook} alt="Facebook-logo" />
                </a>
                <a
                    href="https://www.instagram.com/streetcodeua"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img className="icon" src={Instagram} alt="Instagram-logo" />
                </a>
                <a href="https://twitter.com/streetcodeua" target="_blank" rel="noreferrer">
                    <img className="icon" src={Twitter} alt="Twitter-logo" />
                </a>
                <a href="https://www.tiktok.com/@streetcodeua" target="_blank" rel="noreferrer">
                    <img className="icon" src={TikTok} alt="TikTok-logo" />
                </a>
                <a href="https://www.youtube.com/@streetcodeua" target="_blank" rel="noreferrer">
                    <img className="icon" src={YouTube} alt="YouTube-logo" />
                </a>
            </div>
        </div>
    </div>
);

export default ContactBlock;
