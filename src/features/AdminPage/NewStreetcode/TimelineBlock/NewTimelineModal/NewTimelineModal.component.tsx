/* eslint-disable max-len */
import './NewTimelineModal.style.scss';
import '@features/AdminPage/AdminModal.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import getNewMinNegativeId from '@app/common/utils/newIdForStore';
import useMobx from '@app/stores/root-store';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import { ModelState } from '@models/enums/model-state';
import dayjs from 'dayjs';

import {
    Button,
    DatePicker, Form, Input, Modal, Popover, Select,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';

import createTagValidator from '@/app/common/utils/selectValidation.utility';
import TimelineItem, {
    dateTimePickerTypes,
    DateViewPatternToDatePickerType,
    HistoricalContext, HistoricalContextUpdate, selectDateOptionsforTimeline,
} from '@/models/timeline/chronology.model';

interface NewTimelineModalProps {
    timelineItem?: TimelineItem;
    open: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onChange: (field: string, value: any) => void;
}

const NewTimelineModal: React.FC<NewTimelineModalProps> = observer(({ timelineItem, open, setIsModalOpen, onChange }) => {
    const { timelineItemStore, historicalContextStore } = useMobx();
    const [form] = Form.useForm();
    const selectedContext = useRef<HistoricalContext[]>([]);
    const [dateTimePickerType, setDateTimePickerType] = useState<
        'date' | 'month' | 'year' | 'season-year'>(timelineItem == undefined ? 'date' : DateViewPatternToDatePickerType(timelineItem.dateViewPattern));

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [tagInput, setTagInput] = useState('');
    const maxContextLength = 50;
    const getErrorMessage = (maxLength: number = maxContextLength) => `Довжина не повинна перевищувати ${maxLength} символів`;
    const { onContextKeyDown, handleSearch } = createTagValidator(
        maxContextLength,
        getErrorMessage,
        setTagInput,
        setErrorMessage,
    );

    const clearModal = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (timelineItem && open) {
            form.setFieldsValue({
                title: timelineItem.title,
                description: timelineItem.description,
                date: dayjs(timelineItem.date),
                historicalContexts: timelineItem.historicalContexts
                    .filter((x) => (x as HistoricalContextUpdate).modelState !== ModelState.Deleted)
                    .map((c) => c.title),
            });
            selectedContext.current = timelineItem.historicalContexts;
        } else {
            selectedContext.current = [];
        }
    }, [timelineItem, open, form]);

    useEffect(() => {
        if (timelineItem) {
            setDateTimePickerType(DateViewPatternToDatePickerType(timelineItem.dateViewPattern));
        }
    }, [open]);

    useEffect(() => {
        historicalContextStore.fetchHistoricalContextAll();
    }, []);

    const GetLocalHoursOffset = (date: Date) => -1 * date.getTimezoneOffset() / 60;

    const GetDateBasedOnFormat = (date: Date) => {
        switch (dateTimePickerType) {
        case 'date':
            date.setHours(GetLocalHoursOffset(date), 0, 0, 0);
            return date.toISOString();
        case 'month':
        case 'season-year':
            date.setDate(1);
            date.setHours(GetLocalHoursOffset(date), 0, 0, 0);
            return date.toISOString();
        case 'year':
            date.setMonth(0);
            date.setDate(1);
            date.setHours(GetLocalHoursOffset(date), 0, 0, 0);
            return date.toISOString();
        default:
            throw new Error('Invalid date.');
        }
    };

    const onSuccesfulSubmit = (formValues: any) => {
        if (timelineItem) {
            const item = timelineItemStore.timelineItemMap.get(timelineItem.id);
            if (item) {
                item.date = GetDateBasedOnFormat(new Date(formValues.date));
                item.title = formValues.title;
                item.description = formValues.description;
                item.historicalContexts = selectedContext.current;
                item.dateViewPattern = dateTimePickerTypes.indexOf(dateTimePickerType);
            }
        } else {
            const newTimeline: TimelineItem = {
                date: GetDateBasedOnFormat(new Date(formValues.date)),
                id: getNewMinNegativeId(timelineItemStore.getTimelineItemArray.map((t) => t.id)),
                title: formValues.title,
                description: formValues.description,
                historicalContexts: selectedContext.current,
                dateViewPattern: dateTimePickerTypes.indexOf(dateTimePickerType),
            };
            timelineItemStore.addTimeline(newTimeline);
        }

        setIsModalOpen(false);
        setDateTimePickerType('date');
        form.resetFields();
        onChange('timeline', formValues);
    };

    const onContextSelect = (value: string) => {
        const index = historicalContextStore.historicalContextArray.findIndex((c) => c.title === value);
        if (index < 0) {
            if (value.length > maxContextLength) {
                form.setFieldValue('historicalContexts', selectedContext.current.map((c) => c.title));
                setErrorMessage(getErrorMessage());
                setTagInput('');
                return;
            }
            const newItem: HistoricalContextUpdate = {
                id: getNewMinNegativeId(historicalContextStore.historicalContextArray.map((h) => h.id)),
                title: value,
                modelState: ModelState.Created,
            };

            historicalContextStore.addItemToArray(newItem);
            selectedContext.current.push(newItem);
        } else {
            const persistedContext = selectedContext.current.find((x) => x.title === value) as HistoricalContextUpdate;
            if (persistedContext) { // for case when delete persisted item and add it again
                persistedContext.modelState = ModelState.Updated;
            } else {
                const historicalContext = historicalContextStore.historicalContextArray[index] as HistoricalContextUpdate;
                historicalContext.modelState = ModelState.Created;
                selectedContext.current.push(historicalContext);
            }
        }
        setTagInput('');
        setErrorMessage('');
        onChange('historicalContexts', selectedContext.current);
    };

    const onContextDeselect = (value: string) => {
        const historicalContext = selectedContext.current.find((x) => x.title === value) as HistoricalContextUpdate;
        if (historicalContext?.isPersisted) {
            historicalContext.modelState = ModelState.Deleted;
        } else {
            selectedContext.current = selectedContext.current.filter((s) => s.title !== value);
        }
        onChange('historicalContexts', selectedContext.current);
    };

    return (
        <Modal
            className="modalContainer"
            open={open}
            onCancel={() => {
                setIsModalOpen(false);
                setDateTimePickerType('date');
            }}
            footer={null}
            maskClosable
            centered
            closeIcon={(
                <Popover content="Внесені зміни не будуть збережені!" trigger="hover">
                    <CancelBtn className="iconSize" onClick={clearModal} />
                </Popover>
            )}
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
                        rules={[{ required: true, message: 'Введіть назву', max: 26 }]}
                    >
                        <Input maxLength={26} showCount onChange={(e) => onChange('title', e.target.value)} />
                    </Form.Item>

                    <Form.Item label="Дата:">
                        <div className="data-container">
                            <Select
                                options={selectDateOptionsforTimeline}
                                value={dateTimePickerType}
                                onChange={(val) => {
                                    setDateTimePickerType(val);
                                    onChange('date', val);
                                }}
                            />

                            <Form.Item
                                name="date"
                                rules={[{ required: true, message: 'Введіть дату' }]}
                            >
                                <DatePicker
                                    allowClear={false}
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
                                    onChange={(value) => onChange('date', value?.toString())}
                                />
                            </Form.Item>
                        </div>
                    </Form.Item>

                    <div style={{ position: 'relative' }}>
                        <Form.Item
                            name="historicalContexts"
                            label="Контекст: "
                            validateStatus={errorMessage ? 'error' : ''}
                            help={errorMessage}
                        >
                            <Select
                                mode="tags"
                                onSelect={onContextSelect}
                                onDeselect={onContextDeselect}
                                onInputKeyDown={onContextKeyDown}
                                value={tagInput}
                                onSearch={handleSearch}
                                onChange={(e) => onChange('historicalContexts', e)}
                            >
                                {historicalContextStore.historicalContextArray.map((cntx) => (
                                    <Select.Option key={cntx.id} value={cntx.title}>
                                        {cntx.title}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        {tagInput && (
                            <div className="tagInput-counter">
                                {tagInput.length} / {maxContextLength}
                            </div>
                        )}
                    </div>

                    <Form.Item
                        name="description"
                        label="Опис: "
                        rules={[{ required: true, message: 'Введіть опис' }]}
                    >
                        <TextArea maxLength={400} showCount onChange={(e) => onChange('description', e.target.value)} />
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
