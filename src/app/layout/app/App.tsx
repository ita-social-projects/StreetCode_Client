import './App.styles.scss';
import './ant-styles.overrides.scss';
import { ToastContainer } from "react-toastify";
import Header from "../header/Header.component";
import { Outlet } from "react-router-dom";
import SourcesModal from "@common/components/modals/Sources/SourcesModal.component";
import InterestingFactsModal from "@common/components/modals/InterestingFacts/InterestingFactsModal.component";
import Footer from '../footer/Footer.component';

const App = () => (
    <>
        <ToastContainer position='bottom-right' />
        {
            <>
                <InterestingFactsModal/>
                <SourcesModal />
                <Header />
                <Outlet />
            </>
        }
    </>
);

export default App;