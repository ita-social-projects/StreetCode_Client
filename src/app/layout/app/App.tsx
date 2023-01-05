import './App.styles.scss';

import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import InterestingFactsModal from '@common/components/modals/InterestingFacts/InterestingFactsModal.component';
import SourcesModal from '@common/components/modals/Sources/SourcesModal.component';

import './ant-styles.overrides.scss';

import Footer from '../footer/Footer.component';
import Header from '../header/Header.component';

function App() {
  return (
    <>
      <ToastContainer position="bottom-right" />
      <>
        <InterestingFactsModal />
        <SourcesModal />
        <Header />
        <Outlet />
      </>
    </>
);
}

export default App;
