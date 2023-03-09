import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';

import {
    Button,
    DatePicker, Form, Input, Modal, Select,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Option } from 'antd/es/mentions';

import HistoricalContextStore from '@/app/stores/historicalcontext-store';
import useMobx from '@/app/stores/root-store';
import TimelineStore from '@/app/stores/timeline-store';
import TimelineItem, { HistoricalContext } from '@/models/timeline/chronology.model';

const NewTimelineModal:React.FC<{ indexChange?:number, open:boolean,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = observer(({ indexChange, open, setIsModalOpen }) => {
    const { timelineItemStore } = useMobx();
    const [form] = Form.useForm();
    const historicalContextStore = HistoricalContextStore;
    useEffect(() => {
        historicalContextStore.fetchHistoricalContextAll();
    }, []);
    const onSuccesfulSubmit = (formValues: any) => {
        if (indexChange) {
            timelineItemStore.timelineItemMap.delete(indexChange);
        } else {
            const newTimeline:TimelineItem = { date: formValues.date,
                                               id: timelineItemStore.timelineItemMap.size,
                                               title: formValues.title,
                                               description: formValues.description,
                                               historicalContexts: formValues.historicalContext };
            timelineItemStore.addTimeline(newTimeline);
        }
        setIsModalOpen(false);
        console.log(formValues);
    };
    return (
        <Modal
            open={open}
            onCancel={() => {
                setIsModalOpen(false);
            }}
            footer={[]}
        >
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}
                onFinish={onSuccesfulSubmit}
            >
                <Form.Item
                    name="title"
                    label="Назва: "
                    rules={[{ required: true, message: 'Введіть назву' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="date"
                    label="Дата: "
                    rules={[{ required: true, message: 'Введіть дату' }]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item name="historicalContext" label="Контекст: ">
                    <Select mode="tags">
                        {historicalContextStore.historicalContextArray
                            .map((cntx, index) => (
                                <Option
                                    key={`${index}`}
                                    value={cntx.title}
                                />
                            ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Опис: "
                    rules={[{ required: true, message: 'Введіть опис' }]}
                >
                    <TextArea maxLength={400} showCount />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Додати
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
});
export default NewTimelineModal;
