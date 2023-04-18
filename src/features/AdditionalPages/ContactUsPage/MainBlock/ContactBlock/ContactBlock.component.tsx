import './ContactBlock.styles.scss';

import Email from '@images/contact-us/email.png';
import Facebook from '@images/contact-us/Facebook.png';
import Instagram from '@images/contact-us/Instagram.png';
import Logo from '@images/contact-us/Logo-2.png';
import TikTok from '@images/contact-us/TikTok.png';
import Twitter from '@images/contact-us/Twitter.png';
import YouTube from '@images/contact-us/Youtube.png';

const ContactBlock = () => (
    <div className="contactBlock">
        <img className="contactLogo" src={Logo} alt="" />
        <div className="contactCover">
            <div className="emailBlock">
                <img className="icon" src={Email} alt="email-logo" />
                <span className="email">
                    streetcodeua@gmail.com
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
                <a href="https://youtube.com/streetcodeua" target="_blank" rel="noreferrer">
                    <img className="icon" src={YouTube} alt="YouTube-logo" />
                </a>
            </div>
        </div>
    </div>
);

export default ContactBlock;
