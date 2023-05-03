import './PageBar.styles.scss';

import { Link } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';

const PageBar = () => (
    <div className="PageBarContainer">
        <div className="BarContainer">
            <Link className='Link' to={`/admin-panel/new-streetcode`}>Стріткоди</Link>
            <Link className='Link' to="#">Словник</Link>
            <Link className='Link' to="#">Користувач</Link>
            <Link className='Link' to={FRONTEND_ROUTES.ADMIN.PARTNERS}>Партнери</Link>
            <Link className='Link' to={`${FRONTEND_ROUTES.STREETCODE.BASE}/admin-panel/for-fans`}>Для фанатів</Link>
        </div>
    </div>
);

export default PageBar;
