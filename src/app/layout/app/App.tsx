import './App.styles.scss';
import './ant-styles.overrides.scss';

import useMobx from "@stores/root-store";
import { useAsync } from "@hooks/stateful/useAsync.hook";

import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import ModalWrapper from '@layout/ModalWrapper.component';

const App = () => {
    const { factsStore: { fetchFacts, getFactArray } } = useMobx();
    useAsync(fetchFacts);

    console.log(getFactArray());

    return (
        <>
            <ToastContainer position='bottom-right' />
            {
                <>
                    <ModalWrapper />
                    {/*<Header />*/}
                    <Outlet />
                </>
            }
        </>
    );
};

export default App;