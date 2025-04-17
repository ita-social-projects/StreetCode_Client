import './PageBar.styles.scss';

import { NavLink } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';

const PageBar = () => (
    <div className="PageBarContainer">
        <div className="BarContainer">
            <NavLink className="Link" to={FRONTEND_ROUTES.ADMIN.BASE} end reloadDocument>History-коди</NavLink>
            <NavLink className="Link" to={FRONTEND_ROUTES.ADMIN.PARTNERS} reloadDocument>Партнери</NavLink>
            <NavLink className="Link" to={FRONTEND_ROUTES.ADMIN.EDITOR} reloadDocument>Едітор</NavLink>
            <NavLink className="Link" to={FRONTEND_ROUTES.ADMIN.CALENDAR} reloadDocument>Календар</NavLink>
            <NavLink className="Link" to={`${FRONTEND_ROUTES.ADMIN.TEAM}`} reloadDocument>Команда</NavLink>
            <NavLink className="Link" to={FRONTEND_ROUTES.ADMIN.NEWS} reloadDocument>Новини</NavLink>
            <NavLink className="Link" to={FRONTEND_ROUTES.ADMIN.JOBS} reloadDocument>Вакансії</NavLink>
            <NavLink className="Link" to={FRONTEND_ROUTES.ADMIN.DICTIONARY} reloadDocument>Словник</NavLink>
        </div>
    </div>
);

export default PageBar;
