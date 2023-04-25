import './PageBar.styles.scss';
import { Link } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import ForFansMainPage from '@features/AdminPage/ForFansPage/ForFansMainPage.component';

const PageBar = () => {
  return (
    <div className='PageBarContainer'>
        <div className='BarContainer'>
            <Link className='Link' to={`/admin-panel/new-streetcode`}>Стріткоди</Link>
            <Link className='Link'to="#">Словник</Link>
            <Link className='Link'to="#">Користувач</Link>
            <Link className='Link'to={`/admin-panel/for-fans`}><span>Для фанатів</span></Link>
        </div>
    </div>
  );
}

export default PageBar;
