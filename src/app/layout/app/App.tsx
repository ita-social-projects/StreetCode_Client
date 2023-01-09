import './App.styles.scss';
import './ant-styles.overrides.scss';

import useMobx from "@stores/root-store";
import { observer } from 'mobx-react-lite';
import { useAsync } from "@hooks/stateful/useAsync.hook";

import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import ModalWrapper from '@layout/ModalWrapper.component';

const App = () => {
    /*
    const { factsStore: { fetchFact, fetchFacts, getFactArray } } = useMobx();

    useAsync(() => fetchFact(1));
    console.log(getFactArray());
     */

    return (
        <>
            <ToastContainer position='bottom-right' />
            <ModalWrapper />
            <Outlet />
        </>
    );
};

export default observer(App);