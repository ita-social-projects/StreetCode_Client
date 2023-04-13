import './PageBar.styles.scss';
import { Link } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import ForFansMainPage from '@features/AdminPage/ForFansPage/ForFansMainPage.component';

const PageBar = () => {
  return (
    <div className='PageBarContainer'>
      <div className='BarContainer'>
        <span>Стріткоди</span>
        <span>Словник</span>
        <span>Користувач</span>
        <Link to={`${FRONTEND_ROUTES.STREETCODE.BASE}/admin-panel/for-fans`}><span>Для фанатів</span></Link>
      </div>
    </div>
  );
}

export default PageBar;
