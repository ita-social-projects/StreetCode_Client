import './App.styles.scss';
import './ant-styles.overrides.scss';

import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ModalWrapper from '@layout/ModalWrapper.component';
import useMobx from '@stores/root-store';

const App = () => {
    const { modalStore: { isPageDimmed } } = useMobx();

    return (
        <>
            <ToastContainer position="bottom-right" />
            <ModalWrapper />
            <div className={`${isPageDimmed ? 'dimmed' : ''}`} />
            <Outlet />
        </>
    );
};
export default observer(App);
