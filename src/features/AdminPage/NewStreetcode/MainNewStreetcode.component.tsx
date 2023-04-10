import './MainNewStreetcode.styles.scss';

import React, { useEffect, useState } from 'react';

import { Button, ConfigProvider, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import ukUA from 'antd/locale/uk_UA';

import { PartnerShort } from '@/models/partners/partners.model';
import { MainBlockDataCreate, StreetcodeCreate, StreetcodeType } from '@/models/streetcode/streetcode-types.model';
import { Fact } from '@/models/streetcode/text-contents.model';

import PageBar from '../PageBar/PageBar.component';

import ArtGalleryBlock from './ArtGallery/ArtGallery.component';
import ForFansBlock from './ForFans/ForFans.component';
import RelatedFiguresBlock from './HistoryRelations/HistoryRelations.component';
import InterestingFactsBlock from './InterestingFactsBlock/InterestingFactsBlock.component';
import MainBlockAdmin from './MainBlock/MainBlockAdmin.component';
import PartnerBlockAdmin from './PartnerBlock/PartnerBlockAdmin.components';
import TextBlock from './TextBlock/TextBlock.component';
import TimelineBlockAdmin from './TimelineBlock/TimelineBlockAdmin.component';

const NewStreetcode = () => {
    const [form] = useForm();
    const [partners, setPartners] = useState<PartnerShort[]>([]);

    useEffect(() => {
        if (ukUA.DatePicker) {
            ukUA.DatePicker.lang.locale = 'uk';
        }
    }, []);

    const onChangePartners = (partner: PartnerShort) => {
        setPartners((prevPartners) => [...prevPartners, partner]);
    };

    const onFinish = (data) => {
        const values = form.getFieldsValue();
        console.log(values);
    };

    return (
        <div className="NewStreetcodeContainer">
            <PageBar />
            <ConfigProvider locale={ukUA}>
                <div className="adminPageContainer">
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <MainBlockAdmin form={form} />
                        <TextBlock />
                        <button type="submit">Відправити</button>
                    </Form>
                    <InterestingFactsBlock />
                    <ArtGalleryBlock />
                    <RelatedFiguresBlock />
                    <TimelineBlockAdmin />
                    <ForFansBlock />
                    <PartnerBlockAdmin onChange={onChangePartners} />
                </div>
            </ConfigProvider>
        </div>
    );
};

export default NewStreetcode;
