import React from 'react';
import ForFansBlock from './ForFansBlock/ForFansBlock.component';
import RelatedFiguresBlock from './HistoryRelations/HistoryRelations.component';
import './MainNewStreetcode.styles.scss';
import PageBar from '../PageBar/PageBar.component';
import TextBlock from './TextBlock/TextBlock.component';

const NewStreetcode = () => (
    <div className="NewStreetcodeContainer">
        <TextBlock />
        <RelatedFiguresBlock/>
        <ForFansBlock />
    </div>
    </div>
);

export default NewStreetcode;


 

  