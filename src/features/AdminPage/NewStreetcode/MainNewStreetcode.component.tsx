import './MainNewStreetcode.styles.scss';

import { useEffect, useState } from 'react';
import RelatedFigure from '@models/streetcode/related-figure.model';

import { ConfigProvider, Form } from 'antd';
import ukUA from 'antd/locale/uk_UA';

import { ArtCreate, ArtCreateDTO } from '@/models/media/art.model';
import { PartnerShort } from '@/models/partners/partners.model';

import PageBar from '../PageBar/PageBar.component';

import StreetCodeBlock from './StreetCodeBlock/StreetCodeBlock.component';
import ArtGalleryBlock from './ArtGallery/ArtGallery.component';
import ForFansBlock from './ForFansBlock/ForFansBlock.component';
import RelatedFiguresBlock from './HistoryRelations/HistoryRelations.component';
import InterestingFactsBlock from './InterestingFactsBlock/InterestingFactsBlock.component';
import MapBlockAdmin from './MapBlock/MapBlockAdmin.component';
import PartnerBlockAdmin from './PartnerBlock/PartnerBlockAdmin.components';
import SubtitleBlock from './SubtitileBlock/SubtitleBlock.component';
import TimelineBlockAdmin from './TimelineBlock/TimelineBlockAdmin.component';

const NewStreetcode = () => {
    const [partners, setPartners] = useState<PartnerShort[]>([]);
    const [subTitle, setSubTitle] = useState<string>('');
    const [figures, setFigures] = useState<RelatedFigure[]>([]);
    const [arts, setArts] = useState<ArtCreate[]>([]);

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
                    <StreetCodeBlock />
                    <InterestingFactsBlock />
                    <ArtGalleryBlock arts={arts} setArts={setArts} />
                    <RelatedFiguresBlock setFigures={setFigures} />
                    <TimelineBlockAdmin />
                    <ForFansBlock />
                    <PartnerBlockAdmin setPartners={setPartners} />
                    <SubtitleBlock setSubTitle={setSubTitle} />                   
                     <MapBlockAdmin />
                </div>
            </ConfigProvider>
        </div>
    );
};

export default NewStreetcode;
