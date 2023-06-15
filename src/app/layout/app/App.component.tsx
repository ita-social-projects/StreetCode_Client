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
import useMobx, { useModalContext } from '@stores/root-store';

import Footer from '../footer/Footer.component';
import CopyWithCopyright from '@/app/common/components/CopyWithCopyright.component';

ReactGA.initialize('G-2RHY04JKG0');

const CopyrightText = `© ${new Date().getFullYear()} ГО “Історична Платформа”. При використанні матеріалів сайту посилання на джерело обов’язкове.`;

const App = () => {
    const { pathname } = useLocation();
    const { modalStore: { isPageDimmed } } = useModalContext();

    return (
        <div className="mainBlockWrapper" style={{ position: 'relative' }}>
            <ToastContainer position="bottom-right" limit={3} />
                <ModalWrapper />
                <HeaderBlock />
                <div className="mainWrapper">
                <CopyWithCopyright copyrightText={CopyrightText}>
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
                    </CopyWithCopyright>
                </div>
                <div className="footerWrapper">
                    <Footer />
                </div>
        </div>
    );
};
export default observer(App);
