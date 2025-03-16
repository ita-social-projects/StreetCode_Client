import './Footer.styles.scss';

import FaceBook from '@images/footer/Facebook.svg';
import Instagram from '@images/footer/Instagram.svg';
import StreetcodeFooter from '@images/footer/streetcode-footer.webp';
import Telegram from '@images/footer/Telegram.svg';
import TikTok from '@images/footer/Tik.svg';
import Twitter from '@images/footer/Twitter2.svg';
import Youtube from '@images/footer/You.svg';

import { useEffect, useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import useWindowSize from '@hooks/stateful/useWindowSize.hook';
import { useQuery } from '@tanstack/react-query';

import JobApi from '@/app/api/job/Job.api';
import { ContactUsModal } from '@/app/common/components/modals/ContactUsModal/ContactUsModal.component';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import SOCIAL_MEDIA from '@/app/common/constants/social.constants';
import scrollWithOffset from '@/app/common/utils/window.utility';

const Footer = () => {
    const windowSize = useWindowSize();
    const [hasVacancies, setHasVacancies] = useState(false);
    const REPORTS = 'https://drive.google.com/drive/folders/11Ef4y_6ZHyqT5eDxD5Cn-aWhr-kThh3A?usp=drive_link';

    const { data } = useQuery({
        queryKey: ['jobsActive'],
        queryFn: () => JobApi.getActive(),
    });

    useEffect(() => {
        if (data) {
            setHasVacancies(data.length > 0);
        }
    }, [data]);

    return (
        <>
            {windowSize.width > 1024 && (
                <div className="footerContainer">
                    <div className="footerLogoContainer">
                        <img src={StreetcodeFooter} alt="" />
                    </div>
                    <div className="usefulLinksColumnContainer">
                        <ul className="usefulLinksColumn">
                            <li><Link to={FRONTEND_ROUTES.BASE}>Головна</Link></li>
                            <li><Link to={FRONTEND_ROUTES.OTHER_PAGES.CATALOG}>History-коди</Link></li>
                            <li><Link to={FRONTEND_ROUTES.OTHER_PAGES.ABOUT_US}>Про нас</Link></li>
                            <li><Link to={FRONTEND_ROUTES.OTHER_PAGES.CONTACT_US}>Контакти</Link></li>
                        </ul>
                        <ul className="usefulLinksColumn">
                            <li><Link to={FRONTEND_ROUTES.OTHER_PAGES.PARTNERS}>Партнери</Link></li>
                            {hasVacancies ? (
                                <li>
                                    <Link
                                        to={`${FRONTEND_ROUTES.OTHER_PAGES.ABOUT_US}#vacancies`}
                                        scroll={(el: any) => scrollWithOffset(el, 100)}
                                    >
                                        Вакансії
                                    </Link>
                                </li>
                            ) : null}
                            <li><Link to={FRONTEND_ROUTES.OTHER_PAGES.SUPPORT_US}>Донати</Link></li>
                        </ul>
                        <ul className="usefulLinksColumn supportLinks">
                            <li><Link to={FRONTEND_ROUTES.OTHER_PAGES.PRIVACY_POLICY}>Політика конфіденційності</Link></li>
                            <li><ContactUsModal toggleState={() => { }} text="Зворотний зв&apos;язок" /></li>
                            <li>
                                <a href={REPORTS} target="_blank" rel="noreferrer">
                                    Звітність ГО «Історична Платформа»
                                </a>
                            </li>
                        </ul>
                        <ul className="socialIconContainer">
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
                                <a href={SOCIAL_MEDIA.X} target="_blank" rel="noreferrer">
                                    <Twitter />
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
