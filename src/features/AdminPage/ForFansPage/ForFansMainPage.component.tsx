import './ForFansMainPage.style.scss';

import React from 'react';
import ForFansPageComponent from '@features/AdminPage/ForFansPage/ForFansPage/ForFansPage.component';

import PageBar from '../PageBar/PageBar.component';

const ForFansMainPage = () => (
    <div className="ForFansPageContainer">
        <PageBar />
        <div className="MainForFansContainer">
            <ForFansPageComponent />
        </div>
    </div>
);

export default ForFansMainPage;
