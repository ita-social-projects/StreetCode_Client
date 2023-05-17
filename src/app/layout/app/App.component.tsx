import './App.styles.scss';
import './ant-styles.overrides.scss';

import { observer } from 'mobx-react-lite';
import ReactGA from 'react-ga4';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import MainPage from '@features/MainPage/MainPage.component';
import HeaderBlock from '@layout/header/HeaderBlock.component';
import ModalWrapper from '@layout/ModalWrapper.component';
import useMobx from '@stores/root-store';

import Footer from '../footer/Footer.component';

ReactGA.initialize('G-2RHY04JKG0');

const App = () => {
    const { pathname } = useLocation();
    const { modalStore: { isPageDimmed } } = useMobx();

    return (
        <div style={{ position: 'relative' }}>
            <ToastContainer position="bottom-right" limit={3} />
            <ModalWrapper />
            <HeaderBlock />
            <div className={`${isPageDimmed ? 'dimmed' : ''}`} />
            {(pathname !== FRONTEND_ROUTES.BASE) && (
                <Outlet />
            )}
            {(pathname === FRONTEND_ROUTES.BASE) && (
                <>
                    <Outlet />
                    <MainPage />
                </>
            )}
            {/* <Footer /> */}
        </div>
    );
};
export default observer(App);
