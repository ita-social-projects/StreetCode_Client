import './App.styles.scss';
import './ant-styles.overrides.scss';
import './slick-slider.overrides.scss';

import { observer } from 'mobx-react-lite';
import ReactGA from 'react-ga4';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import MainPage from '@features/MainPage/MainPage.component';
import HeaderBlock from '@layout/header/HeaderBlock.component';
import ModalWrapper from '@layout/ModalWrapper.component';
import { useModalContext } from '@stores/root-store';

import CopyWithCopyright from '@/app/common/components/CopyWithCopyright.component';
import ListenTextModal from '@/app/common/components/modals/ListenText/ListenText.component';

import Footer from '../footer/Footer.component';

ReactGA.initialize('G-2RHY04JKG0');

const CopyrightText = `Джерело: «Historycode: історія на кожному кроці» ${window.location.origin}`;

const App = () => {
    const { pathname } = useLocation();
    const { modalStore: { isPageDimmed } } = useModalContext();

    const isAdminPanel = pathname.startsWith('/admin-panel');

    return (
        <div className="mainBlockWrapper" style={{ position: 'relative' }}>
            <ListenTextModal />
            <ToastContainer position="bottom-right" limit={3} />
            <CopyWithCopyright copyrightText={CopyrightText}>
                <ModalWrapper />
            </CopyWithCopyright>
            {!isAdminPanel && <HeaderBlock />}
            <div className="mainWrapper">
                <div className={`${isPageDimmed ? 'dimmed' : ''}`} />
                <CopyWithCopyright copyrightText={CopyrightText} className='mainBlockWrapper'>
                    {(pathname !== FRONTEND_ROUTES.BASE) && (
                        <Outlet />
                    )}
                    {(pathname === FRONTEND_ROUTES.BASE) && (
                        <>
                            <Outlet />
                            <MainPage />
                        </>
                    )}
                </CopyWithCopyright>
            </div>
            {!isAdminPanel && <div className="footerWrapper">
                <Footer />
            </div>}
        </div>
    );
};
export default observer(App);
