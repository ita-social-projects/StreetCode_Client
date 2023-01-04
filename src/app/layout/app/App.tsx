import './App.styles.scss';
import './ant-styles.overrides.scss';
import { ToastContainer } from "react-toastify";
import Header from "../header/Header.component";
import { Outlet } from "react-router-dom";

import SourcesModal from "@common/components/modals/Sources/SourcesModal.component";
import InterestingFactsModal from "@common/components/modals/InterestingFacts/InterestingFactsModal.component";

import useMobx from "@stores/root-store";
import { useAsync } from "@common/hooks/stateful/useAsync.hook";

const App = () => {
    const { factsStore: { fetchFacts, getFactArray } } = useMobx();
    useAsync(fetchFacts);

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

export default App;