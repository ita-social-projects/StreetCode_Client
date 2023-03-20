import React from 'react';
import ForFansBlock from './ForFans/ForFans.component';
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
);

export default NewStreetcode;