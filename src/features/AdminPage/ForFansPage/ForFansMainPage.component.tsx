import React from 'react';
import ForFansPage from './ForFansPage/ForFansPage.component';
import './ForFansMainPage.style.scss';
import PageBar from '../PageBar/PageBar.component';


const ForFansMainPage = () => (
    <div className="ForFansPageContainer">
        <PageBar/>
    <div className="MainForFansPageContainer">
        <ForFansPage />
    </div>
    </div>
);

export default ForFansMainPage;