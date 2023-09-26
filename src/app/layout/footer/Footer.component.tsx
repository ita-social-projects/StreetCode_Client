import './Footer.styles.scss';

import FaceBook from '@images/footer/Facebook.webp';
import Instagram from '@images/footer/Instagram.webp';
import StreetcodeFooter from '@images/footer/streetcode-footer.webp';
import TikTok from '@images/footer/TikTok.webp';
import Twitter from '@images/footer/Twitter.webp';
import Youtube from '@images/footer/Youtube.webp';

import { useEffect, useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import useWindowSize from '@hooks/stateful/useWindowSize.hook';

import JobApi from '@/app/api/job/Job.api';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import scrollWithOffset from '@/app/common/utils/window.utility';

const Footer = () => {
    const windowSize = useWindowSize();
    const [hasVacancies, setHasVacancies] = useState(false);
    useEffect(() => {
        JobApi.getActive()
            .then(
                (result) => {
                    setHasVacancies(result.length > 0);
                },
            )
            .catch();
    }, []);
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
                            {hasVacancies ? (
                                <li>
                                    <Link
                                        to={`${FRONTEND_ROUTES.OTHER_PAGES.ABOUT_US}#vacancies`}
                                        scroll={(el:any) => scrollWithOffset(el, 100)}
                                    >
                                        Вакансії
                                    </Link>
                                </li>
                            ) : null}
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
                                <a href="https://www.youtube.com/@streetcodeua" target="_blank" rel="noreferrer">
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
                        ©
                        {' '}
                        {new Date().getFullYear()}
                        {' '}
                        ГО «Історична Платформа». При використанні матеріалів сайту посилання на джерело
                        обов’язкове.
                    </p>
                </div>
            </section>
        </>
    );
};

export default Footer;
