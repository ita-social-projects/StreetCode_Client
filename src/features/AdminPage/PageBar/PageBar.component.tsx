import './PageBar.styles.scss';

import { Link } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';

const PageBar = () => (
    <div className="PageBarContainer">
        <div className="BarContainer">
            <Link className='Link' to={FRONTEND_ROUTES.ADMIN.BASE}>Стріткоди</Link>
            <Link className='Link' to={FRONTEND_ROUTES.ADMIN.DICTIONARY}>Словник</Link>
            <Link className='Link' to={FRONTEND_ROUTES.ADMIN.PARTNERS}>Партнери</Link>
            <Link className='Link' to={FRONTEND_ROUTES.ADMIN.FOR_FANS}>Категорії для фанатів</Link>
            <Link className='Link' to={`${FRONTEND_ROUTES.ADMIN.TEAM}`}>Команда</Link>
            <Link className='Link' to={FRONTEND_ROUTES.ADMIN.NEWS}>Новини</Link>

        </div>
    </div>
);

export default PageBar;
