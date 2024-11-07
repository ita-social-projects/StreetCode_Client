import './PageBar.styles.scss';

import React from 'react';
import { NavLink } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';

const PageBar = () => (
    <div className="PageBarContainer">
        <div className="BarContainer">
            <NavLink className="Link" to={FRONTEND_ROUTES.ADMIN.BASE} end>Стріткоди</NavLink>
            <NavLink className="Link" to={FRONTEND_ROUTES.ADMIN.PARTNERS}>Партнери</NavLink>
            <NavLink className="Link" to={FRONTEND_ROUTES.ADMIN.EDITOR}>Едітор</NavLink>
            <NavLink className="Link" to={`${FRONTEND_ROUTES.ADMIN.TEAM}`}>Команда</NavLink>
            <NavLink className="Link" to={FRONTEND_ROUTES.ADMIN.NEWS}>Новини</NavLink>
            <NavLink className="Link" to={FRONTEND_ROUTES.ADMIN.JOBS}>Вакансії</NavLink>
        </div>
    </div>
);

export default PageBar;
