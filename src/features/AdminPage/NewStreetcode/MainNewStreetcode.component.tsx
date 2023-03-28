import React from 'react';
import ForFansBlock from './ForFansBlock/ForFansBlock.component';
import RelatedFiguresBlock from './HistoryRelations/HistoryRelations.component';
import './MainNewStreetcode.styles.scss';
import PageBar from '../PageBar/PageBar.component';


const NewStreetcode = () => (
    <div className="NewStreetcodePageContainer">
    <PageBar/>
    <div className="MainNewStreetcodeContainer">
        <ForFansBlock />
    </div>
    </div>
);

export default NewStreetcode;


 

  