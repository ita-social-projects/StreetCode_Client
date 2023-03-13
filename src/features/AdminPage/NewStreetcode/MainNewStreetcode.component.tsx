import React from 'react';
import ForFansBlock from './ForFans/ForFans.component';
import RelatedFiguresBlock from './HistoryRelations/HistoryRelations.component';
import './MainNewStreetcode.styles.scss';
import PageBar from '../PageBar/PageBar.component';
import MainBlockAdmin from './MainBlock/MainBlockAdmin.component';
import ArtGalleryBlock from './ArtGallery/ArtGallery.component';

const NewStreetcode = () => (
    <div>
        <PageBar/>
        <div className="NewStreetcodeContainer">
            <MainBlockAdmin/>
            <ArtGalleryBlock/>
            <RelatedFiguresBlock/>
            <ForFansBlock />
        </div>
    </div>
    
); 

export default NewStreetcode;