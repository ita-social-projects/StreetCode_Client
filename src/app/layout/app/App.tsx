import './App.styles.scss';
import './ant-styles.overrides.scss';

import useMobx from "@stores/root-store";
import { useAsync } from "@common/hooks/stateful/useAsync.hook";
import { observer } from 'mobx-react-lite';

import { ToastContainer } from "react-toastify";
import Header from "../header/Header.component";
import { Outlet } from "react-router-dom";

import SourcesModal from "@common/components/modals/Sources/SourcesModal.component";
import InterestingFactsModal from "@common/components/modals/InterestingFacts/InterestingFactsModal.component";

const App = () => {
    const { factsStore: { fetchFact, fetchFacts, getFactArray } } = useMobx();

    useAsync(() => fetchFact(1));
    console.log(getFactArray());

    return (
        <>
            <ToastContainer position='bottom-right'/>
            {
                <>
                    <InterestingFactsModal/>
                    <SourcesModal/>
                    <Header/>
                    <Outlet/>
                </>
            }
        </>
    );
};

export default observer(App);