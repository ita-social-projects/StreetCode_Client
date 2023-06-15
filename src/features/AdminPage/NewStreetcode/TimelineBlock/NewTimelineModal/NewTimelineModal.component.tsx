import './NewTimelineModal.style.scss';
import '@features/AdminPage/AdminModal.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import dayjs from 'dayjs';

import {
    Button,
    DatePicker, Form, Input, Modal, Select,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Option } from 'antd/es/mentions';

import getNewMinNegativeId from '@/app/common/utils/newIdForStore';
import useMobx from '@/app/stores/root-store';
import TimelineItem, {
    dateTimePickerTypes,
    HistoricalContext, selectDateOptionsforTimeline,
} from '@/models/timeline/chronology.model';

const NewTimelineModal: React.FC<{
    timelineItem?: TimelineItem, open: boolean,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = observer(({ timelineItem, open, setIsModalOpen }) => {
    const { timelineItemStore, historicalContextStore } = useMobx();
    const [form] = Form.useForm();
    const selectedContext = useRef<HistoricalContext[]>([]);
    const [dateTimePickerType, setDateTimePickerType] = useState<
        'date' | 'month' | 'year' | 'season-year'>('date');
    const localOffset = new Date().getTimezoneOffset() * 60000; // Offset in milliseconds

    useEffect(() => {
        if (timelineItem && open) {
            form.setFieldsValue({
                title: timelineItem.title,
                description: timelineItem.description,
                date: dayjs(timelineItem.date),
                historicalContexts: timelineItem.historicalContexts.map((c) => c.title),
            });
            selectedContext.current = timelineItem.historicalContexts;
        } else {
            selectedContext.current = [];
        }
    }, [timelineItem, open, form]);
    useEffect(() => {
        historicalContextStore.fetchHistoricalContextAll();
    }, []);

    const onSuccesfulSubmit = (formValues: any) => {
        if (timelineItem) {
            const item = timelineItemStore.timelineItemMap.get(timelineItem.id);
            if (item) {
                item.date = new Date(formValues.date - localOffset);
                item.title = formValues.title;
                item.description = formValues.description;
                item.historicalContexts = selectedContext.current;
            }
        } else {
            const newTimeline: TimelineItem = {
                date: new Date(formValues.date - localOffset),
                id: getNewMinNegativeId(timelineItemStore.getTimelineItemArray.map((t) => t.id)),
                title: formValues.title,
                description: formValues.description,
                historicalContexts: selectedContext.current,
                dateViewPattern: dateTimePickerTypes.indexOf(dateTimePickerType),
            };
            timelineItemStore.addTimeline(newTimeline);
        }

        setIsModalOpen(false);
        form.resetFields();
    };
    const onContextSelect = (value: string) => {
        const index = historicalContextStore.historicalContextArray.findIndex((c) => c.title === value);
        if (index < 0) {
            if (value.length > 50) {
                form.setFieldValue('historicalContexts', selectedContext.current.map((c) => c.title));
                return;
            }
            const newItem = { id: 0, title: value };
            historicalContextStore.addItemToArray(newItem);
            selectedContext.current.push(newItem);
        } else {
            selectedContext.current.push(historicalContextStore.historicalContextArray[index]);
        }
    };
    const onContextDeselect = (value: string) => {
        selectedContext.current = selectedContext.current.filter((s) => s.title !== value);
    };
    return (
        <Modal
            className="modalContainer"
            open={open}
            onCancel={() => {
                setIsModalOpen(false);
            }}
            footer={null}
            closeIcon={<CancelBtn />}
        >
            <div className="modalContainer-content">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onSuccesfulSubmit}
                >
                    <div className="center">
                        <h2>Хронологія</h2>
                    </div>

                    <Form.Item
                        name="title"
                        label="Назва: "
                        rules={[{ required: true, message: 'Введіть назву', max: 50 }]}
                    >
                        <Input maxLength={50} showCount />
                    </Form.Item>

                    <Form.Item label="Дата:">
                        <div className="data-container">
                            <Select
                                options={selectDateOptionsforTimeline}
                                defaultValue={dateTimePickerType}
                                onChange={(val) => {
                                    setDateTimePickerType(val);
                                }}
                            />

                            <Form.Item
                                name="date"
                                rules={[{ required: true, message: 'Введіть дату' }]}
                            >
                                <DatePicker
                                    picker={(dateTimePickerType !== 'season-year') ? dateTimePickerType : 'month'}
                                    format={(dateTimePickerType === 'date'
                                        ? 'YYYY, D MMMM'
                                        : dateTimePickerType === 'year'
                                            ? 'YYYY'
                                            : 'YYYY, MMMM')}
                                    placeholder={(dateTimePickerType === 'date'
                                        ? 'yyyy, dd mm'
                                        : dateTimePickerType === 'year'
                                            ? 'yyyy'
                                            : 'yyyy, mm')}
                                />
                            </Form.Item>
                        </div>
                    </Form.Item>

                    <Form.Item
                        name="historicalContexts"
                        label="Контекст: "
                    >
                        <Select
                            mode="tags"
                            onSelect={onContextSelect}
                            onDeselect={onContextDeselect}
                            maxLength={20}
                        >
                            {historicalContextStore.historicalContextArray
                                .map((cntx, index) => (
                                    <Option
                                        key={`${cntx.id + index}`}
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
                    <div className="center">
                        <Button className="streetcode-custom-button" type="primary" htmlType="submit">
                            Зберегти
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
});
export default NewTimelineModal;
