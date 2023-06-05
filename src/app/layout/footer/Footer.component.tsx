import './Footer.styles.scss';

import FaceBook from '@images/footer/Facebook.png';
import Instagram from '@images/footer/Instagram.png';
import StreetcodeFooter from '@images/footer/streetcode-footer.png';
import TikTok from '@images/footer/TikTok.png';
import Twitter from '@images/footer/Twitter.png';
import Youtube from '@images/footer/Youtube.png';

import useWindowSize from '@hooks/stateful/useWindowSize.hook';

import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';

const Footer = () => {
    const windowSize = useWindowSize();
    return (
        <>
            {windowSize.width > 1024 && (
                <div className="footerContainer">
                    <div className="footerLogoContainer">
                        <img src={StreetcodeFooter} alt="" />
                    </div>
                    <div className="usefulLinksColumnContainer">
                        <ul className="usefulLinksColumn">
                            <li><a href={FRONTEND_ROUTES.BASE}>Головна</a></li>
                            <li><a href={FRONTEND_ROUTES.OTHER_PAGES.CATALOG}>Стріткоди</a></li>
                            <li><a href={FRONTEND_ROUTES.OTHER_PAGES.ERROR404}>Маршрути</a></li>
                            <li><a href={FRONTEND_ROUTES.OTHER_PAGES.ERROR404}>Блог</a></li>
                            <li><a href={FRONTEND_ROUTES.OTHER_PAGES.ERROR404}>Про проєкт</a></li>
                            <li><a href={FRONTEND_ROUTES.OTHER_PAGES.CONTACT_US}>Контакти</a></li>
                        </ul>
                        <ul className="usefulLinksColumn">
                            <li><a href={FRONTEND_ROUTES.OTHER_PAGES.PARTNERS}>Партнери</a></li>
                            <li><a href={FRONTEND_ROUTES.OTHER_PAGES.ERROR404}>Вакансії</a></li>
                            <li><a href={FRONTEND_ROUTES.OTHER_PAGES.SUPPORT_US}>Донати</a></li>
                        </ul>
                        <ul className="usefulLinksColumn supportLinks">
                            <li><a href={FRONTEND_ROUTES.OTHER_PAGES.PRIVACY_POLICY}>Політика конфіденційності</a></li>
                            <li><a href={FRONTEND_ROUTES.OTHER_PAGES.CONTACT_US}>Зворотний зв&apos;язок</a></li>
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
                    </div>
                </div>
            )}
            <section>
                <div className="footerCopyright">
                    <p>
                        © {new Date().getFullYear()} ГО «Історична Платформа» . При використанні матеріалів сайту посилання на джерело
                        обов’язкове.
                    </p>
                </div>
            </section>
        </>
    );
};

export default Footer;
