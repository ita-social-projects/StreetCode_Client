import './PageBar.styles.scss';

import { Link } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';

const PageBar = () => (
    <div className="PageBarContainer">
        <div className="BarContainer">
            <Link className="Link" to={FRONTEND_ROUTES.ADMIN.BASE} reloadDocument>Стріткоди</Link>
            <Link className="Link" to={FRONTEND_ROUTES.ADMIN.PARTNERS} reloadDocument>Партнери</Link>
            <Link className="Link" to={FRONTEND_ROUTES.ADMIN.EDITOR} reloadDocument>Едітор</Link>
            <Link className="Link" to={`${FRONTEND_ROUTES.ADMIN.TEAM}`} reloadDocument>Команда</Link>
            <Link className="Link" to={FRONTEND_ROUTES.ADMIN.NEWS} reloadDocument>Новини</Link>
            <Link className="Link" to={FRONTEND_ROUTES.ADMIN.JOBS} reloadDocument>Вакансії</Link>
        </div>
    </div>
);

export default PageBar;
