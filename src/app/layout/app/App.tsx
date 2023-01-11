import './App.styles.scss';
import './ant-styles.overrides.scss';

import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ModalWrapper from '@layout/ModalWrapper.component';

const App = () => (
    <>
        <ToastContainer position="bottom-right" />
        <ModalWrapper />
        <Outlet />
    </>
);
export default observer(App);
