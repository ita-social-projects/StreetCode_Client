import './MainNewStreetcode.styles.scss';

import React, { useEffect } from 'react';

import { ConfigProvider, Form } from 'antd';
import ukUA from 'antd/locale/uk_UA';

import PageBar from '../PageBar/PageBar.component';

import StreetCodeBlock from './StreetCodeBlock/StreetCodeBlock.component';
import ForFansBlock from './ForFansBlock/ForFansBlock.component';
import RelatedFiguresBlock from './HistoryRelations/HistoryRelations.component';
import MainBlockAdmin from './MainBlock/MainBlockAdmin.component';
import PartnerBlockAdmin from './PartnerBlock/PartnerBlockAdmin.components';
import TextBlock from './TextBlock/TextBlock.component';
import TimelineBlockAdmin from './TimelineBlock/TimelineBlockAdmin.component';
import ArtGalleryBlock from './ArtGallery/ArtGallery.component';
import InterestingFactsBlock from './InterestingFactsBlock/InterestingFactsBlock.component';
import MapBlockAdmin from './MapBlock/MapBlockAdmin.component';
import SubtitleBlock from './SubtitileBlock/SubtitleBlock.component';


const NewStreetcode = () => {    
    useEffect(() => {
        if (ukUA.DatePicker) {
            ukUA.DatePicker.lang.locale = 'uk';
        }
    }, []);
    return (
        <div className="NewStreetcodeContainer">
           <PageBar />
            <ConfigProvider locale={ukUA}>
                <div className="adminContainer">
                    <StreetCodeBlock/>
                    <InterestingFactsBlock />
                    <ArtGalleryBlock />
                    <RelatedFiguresBlock />
                    <TimelineBlockAdmin />
                    <ForFansBlock />
                    <PartnerBlockAdmin />
                    <SubtitleBlock />
                    <MapBlockAdmin/>
                </div>
            </ConfigProvider>

        </div>
    );
};

export default NewStreetcode;
