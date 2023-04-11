import { Link } from 'react-router-dom';
import './PageBar.styles.scss';

import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';

const PageBar = () => (
    <div className="PageBarContainer">
        <div className="BarContainer">
            <span>Стріткоди</span>
            <span>Словник</span>
            <span>Користувач</span>
            <span><Link to={FRONTEND_ROUTES.ADMIN.PARTNERS}>Партнери</Link></span>
        </div>
    </div>
);

export default PageBar;
