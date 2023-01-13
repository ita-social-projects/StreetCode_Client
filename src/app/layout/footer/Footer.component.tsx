import './Footer.styles.scss';

import FaceBook from '@images/footer/Facebook.png';
import Instagram from '@images/footer/Instagram.png';
import StreetcodeFooter from '@images/footer/streetcode-footer.png';
import TikTok from '@images/footer/TikTok.png';
import Twitter from '@images/footer/Twitter.png';

interface Props {

}

const Footer = (props: Props) => (
    <>
        <div className="footerContainer">
            <div className="footerLogoContainer">
                <img src={StreetcodeFooter} alt="" />
            </div>
            <div className="usefulLinksColumnContainer">
                <ul className="usefulLinksColumn">
                    <li>Головна</li>
                    <li>Стріткоди</li>
                    <li>Маршрути</li>
                    <li>Блог</li>
                    <li>Про проект</li>
                    <li>Контакти</li>
                </ul>
                <ul className="usefulLinksColumn">
                    <li>Партнери</li>
                    <li>Вакансії</li>
                    <li>Донати</li>
                </ul>
                <ul className="usefulLinksColumn supportLinks">
                    <li>Політика конфіденційності</li>
                    <li>Зворотній зв'язок</li>
                    <li>Cookies</li>
                </ul>
                <ul className="socialIconContainer">
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
                        <a href="https://www.tiktok.com/@streetcodeua" target="_blank" rel="noreferrer">
                            <img src={TikTok} alt="" />
                        </a>
                    </li>
                    <li>
                        <a href="https://twitter.com/streetcodeua" target="_blank" rel="noreferrer">
                            <img src={Twitter} alt="" />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <section>
            <div className="footerCopyright">
                <p>
                    © 2022 ГО “Історична Платформа” . При використанні матеріалів сайту посилання на джерело
                    обов’язкове.
                </p>
            </div>
        </section>
    </>
);

export default Footer;
