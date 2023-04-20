import './MainNewStreetcode.styles.scss';

import React, { useEffect, useState } from 'react';

import { ConfigProvider, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import ukUA from 'antd/locale/uk_UA';

import { ArtCreate } from '@/models/media/art.model';

import PageBar from '../PageBar/PageBar.component';

import ArtGalleryBlock from './ArtGallery/ArtGallery.component';
import ForFansBlock from './ForFansBlock/ForFansBlock.component';
import RelatedFiguresBlock from './HistoryRelations/HistoryRelations.component';
import InterestingFactsBlock from './InterestingFactsBlock/InterestingFactsBlock.component';
import MainBlockAdmin from './MainBlock/MainBlockAdmin.component';
import MapBlockAdmin from './MapBlock/MapBlockAdmin.component';
import PartnerBlockAdmin from './PartnerBlock/PartnerBlockAdmin.components';
import SubtitleBlock from './SubtitileBlock/SubtitleBlock.component';
import TextBlock from './TextBlock/TextBlock.component';
import TimelineBlockAdmin from './TimelineBlock/TimelineBlockAdmin.component';
import { SourceCategory, StreetcodeCategoryContent } from '@/models/sources/sources.model';

const NewStreetcode = () => {
    const [form] = useForm();
    useEffect(() => {
        if (ukUA.DatePicker) {
            ukUA.DatePicker.lang.locale = 'uk';
        }
    }, []);
    const [arts, setArts] = useState<ArtCreate[]>([]);
    const [categories, setCategories] = useState<StreetcodeCategoryContent[]>([]);
    return (
        <div className="NewStreetcodeContainer">
            <PageBar />
            <ConfigProvider locale={ukUA}>
                <div className="adminPageContainer">
                    <Form form={form} layout="vertical">
                        <MainBlockAdmin form={form} />
                        <TextBlock />
                    </Form>
                    <InterestingFactsBlock />
                    <ArtGalleryBlock arts={arts} setArts={setArts} />
                    {/*  <RelatedFiguresBlock /> */}
                    <TimelineBlockAdmin />
                    <ForFansBlock categories={categories} />
                    <PartnerBlockAdmin />
                    <SubtitleBlock />
                    <MapBlockAdmin />
                </div>
            </ConfigProvider>

        </div>
    );
};

export default NewStreetcode;
