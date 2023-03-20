import './MainNewStreetcode.styles.scss';

import React, { useEffect } from 'react';

import { ConfigProvider, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import ukUA from 'antd/locale/uk_UA';

import PageBar from '../PageBar/PageBar.component';

import ForFansBlock from './ForFans/ForFans.component';
import RelatedFiguresBlock from './HistoryRelations/HistoryRelations.component';
import MainBlockAdmin from './MainBlock/MainBlockAdmin.component';
import TextBlock from './TextBlock/TextBlock.component';
import TimelineBlockAdmin from './TimelineBlock/TimelineBlockAdmin.component';

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

                    <RelatedFiguresBlock />
                    <TimelineBlockAdmin />
                    <ForFansBlock />
                </div>
            </ConfigProvider>

        </div>
    );
};

export default NewStreetcode;
