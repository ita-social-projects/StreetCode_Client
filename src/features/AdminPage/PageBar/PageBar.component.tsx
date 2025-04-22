import './PageBar.styles.scss';

import StreetcodeSvg from '@images/header/Streetcode_logo.svg';
import StreetcodeSvgMobile from '@images/header/Streetcode_logo_mobile.svg';

import { Link, NavLink, useNavigate } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import { useMediaQuery } from 'react-responsive';
import AuthService from '@/app/common/services/auth-service/AuthService';
import exitBtnImg from '@assets/images/admin-panel/ExitIcon.webp';


const PageBar = () => {
    const isDesktop = useMediaQuery({
        query: '(min-width: 1025px)',
    });

    const navigate = useNavigate();

    const handleLogout = () => {
        AuthService.logout()
        navigate(FRONTEND_ROUTES.BASE);
    }

    return (
        <div className="PageBarContainer">
            <div className="LogoContainer">
                <Link to={FRONTEND_ROUTES.BASE}>
                    {isDesktop ? (
                        <StreetcodeSvg />
                    ) : (
                    <StreetcodeSvgMobile />
                    )}
                </Link>
            </div>
            <div className="BarContainer">
                <NavLink className="Link" to={FRONTEND_ROUTES.ADMIN.BASE} end reloadDocument>History-коди</NavLink>
                <NavLink className="Link" to={FRONTEND_ROUTES.ADMIN.PARTNERS} reloadDocument>Партнери</NavLink>
                <NavLink className="Link" to={FRONTEND_ROUTES.ADMIN.EDITOR} reloadDocument>Едітор</NavLink>
                <NavLink className="Link" to={`${FRONTEND_ROUTES.ADMIN.TEAM}`} reloadDocument>Команда</NavLink>
                <NavLink className="Link" to={FRONTEND_ROUTES.ADMIN.NEWS} reloadDocument>Новини</NavLink>
                <NavLink className="Link" to={FRONTEND_ROUTES.ADMIN.JOBS} reloadDocument>Вакансії</NavLink>
                <NavLink className="Link" to={FRONTEND_ROUTES.ADMIN.DICTIONARY} reloadDocument>Словник</NavLink>
            </div>
            <div className="ExitButton">
                <button type="button" onClick={handleLogout}>
                    <img src={exitBtnImg} alt="Exit" className="exit-btn-icon" />
                    Вихід
                </button>
            </div>
        </div>
    );
};

export default PageBar;
