
import './AdminPage.styles.scss';

import { useState } from 'react';
import StreetcodesTable from "./StreetcodesTable/StreetcodesTable.component";
import PageBar from "./PageBar/PageBar.component";
import {RemoveScroll} from 'react-remove-scroll';
import InterestingFactsBlock from './NewStreetcode/InterestingFactsBlock/InterestingFactsBlock.component';

const AdminPage = () => (
    // <RemoveScroll>
        <div className="adminPageContainer">
            <StreetcodesTable/>
            <PageBar/>
        </div>
    // </RemoveScroll> 
);

export default AdminPage;

