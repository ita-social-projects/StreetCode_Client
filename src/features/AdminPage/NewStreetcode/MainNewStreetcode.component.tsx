import React from 'react';
import ForFansBlock from './ForFans/ForFans.component';
import RelatedFiguresBlock from './HistoryRelations/HistoryRelations.component';
import './MainNewStreetcode.styles.scss';
import PageBar from '../PageBar/PageBar.component';

const NewStreetcode = () => (
    <div>
        <PageBar/>
        <div className="NewStreetcodeContainer">
            <RelatedFiguresBlock/>
            <ForFansBlock />
        </div>
    </div>
    
); 

export default NewStreetcode;