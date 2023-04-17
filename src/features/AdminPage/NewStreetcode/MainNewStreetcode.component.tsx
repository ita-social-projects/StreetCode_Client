import './MainNewStreetcode.styles.scss';

import React, { useEffect } from 'react';

import { ConfigProvider, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import ukUA from 'antd/locale/uk_UA';

import PageBar from '../PageBar/PageBar.component';

import ForFansBlock from './ForFansBlock/ForFansBlock.component';
import RelatedFiguresBlock from './HistoryRelations/HistoryRelations.component';
import MainBlockAdmin from './MainBlock/MainBlockAdmin.component';
import PartnerBlockAdmin from './PartnerBlock/PartnerBlockAdmin.components';
import TextBlock from './TextBlock/TextBlock.component';
import TimelineBlockAdmin from './TimelineBlock/TimelineBlockAdmin.component';
import ArtGalleryBlock from './ArtGallery/ArtGallery.component';
import InterestingFactsBlock from './InterestingFactsBlock/InterestingFactsBlock.component';
import SubtitleBlock from './SubtitileBlock/SubtitleBlock.component';

const NewStreetcode = () => {
    const [form] = useForm();
    useEffect(() => {
        if (ukUA.DatePicker) {
            ukUA.DatePicker.lang.locale = 'uk';
        }
    }, []);
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
                    <ArtGalleryBlock />
                   {/*  <RelatedFiguresBlock /> */}
                    <TimelineBlockAdmin />
                    <ForFansBlock />
                    <PartnerBlockAdmin />
                    <SubtitleBlock />
                </div>
            </ConfigProvider>

        </div>
    );
};

export default NewStreetcode;
