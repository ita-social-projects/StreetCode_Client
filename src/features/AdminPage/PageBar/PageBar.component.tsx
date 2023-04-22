import './PageBar.styles.scss';

import { Link } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';

const PageBar = () => (
    <div className="PageBarContainer">
        <div className="BarContainer">
            <span>Стріткоди</span>
            <span>Словник</span>
            <span>Користувач</span>
            <span><Link to={FRONTEND_ROUTES.ADMIN.PARTNERS}>Партнери</Link></span>
            <Link to={`${FRONTEND_ROUTES.STREETCODE.BASE}/admin-panel/for-fans`}><span>Для фанатів</span></Link>
        </div>
    </div>
);

export default PageBar;
