import './App.styles.scss';
import './ant-styles.overrides.scss';

import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import HeaderBlock from '@layout/header/HeaderBlock.component';
import ModalWrapper from '@layout/ModalWrapper.component';

const App = () => {
    const { pathname } = useLocation();

    return (
        <>
            <ToastContainer position="bottom-right" limit={5} />
            <ModalWrapper />
            <HeaderBlock />
            {(pathname === FRONTEND_ROUTES.BASE) && (
                <Outlet />
            )}
        </>
    );
};
export default App;
