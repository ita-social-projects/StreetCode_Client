/* eslint-disable max-len */
import './NewTimelineModal.style.scss';
import '@features/AdminPage/AdminModal.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import getNewMinNegativeId from '@app/common/utils/newIdForStore';
import useMobx from '@stores/root-store';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import { ModelState } from '@models/enums/model-state';
import dayjs from 'dayjs';

import {
    Button,
    DatePicker, Form, Input, message, Modal, Popover, Select,
} from 'antd';

import createTagValidator from '@/app/common/utils/selectValidation.utility';
import TimelineItem, {
    dateTimePickerTypes,
    DateViewPatternToDatePickerType,
    HistoricalContext, HistoricalContextUpdate, selectDateOptionsforTimeline,
} from '@/models/timeline/chronology.model';
import POPOVER_CONTENT from '@/features/AdminPage/JobsPage/JobsModal/constants/popoverContent';
import uniquenessValidator from '@/app/common/utils/uniquenessValidator';
import BUTTON_LABELS from "@constants/buttonLabels";

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
	const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
    const [selectContextOpen, setSelectContextOpen] = useState(false);
    const selectInputContainerRef = useRef<HTMLDivElement | null>(null);

    const MAX_LENGTH = {
        title: 26,
        description: 400,
        context: 50,
    };

    const MAX_CONTEXTS_COUNT = 1;

    const getErrorMessage = (maxLength: number = MAX_LENGTH.context) => `Довжина не повинна перевищувати ${maxLength} символів`;
    const { onContextKeyDown, handleSearch } = createTagValidator(
        MAX_LENGTH.context,
        getErrorMessage,
        setTagInput,
        setErrorMessage,
    );

    const clearModal = () => {
        form.resetFields();
        setIsModalOpen(false);
        setErrorMessage('');
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

    const GetLocalMinutesOffset = (date: Date) => -1 * date.getTimezoneOffset();

    const GetDateBasedOnFormat = (date: Date) => {
        let seconds = 0;
        // specific GMT+202 Ukraine timezone before 1/5/1924, where seconds are truncated by browser
        if (GetLocalMinutesOffset(date) == 122) {
            seconds = 4;
        }
        date.setHours(0, GetLocalMinutesOffset(date), seconds, 0);
        switch (dateTimePickerType) {
        case 'date':
            return date.toISOString();
        case 'month':
        case 'season-year':
            date.setDate(1);
            return date.toISOString();
        case 'year':
            date.setMonth(0);
            date.setDate(1);
            return date.toISOString();
        default:
            throw new Error('Invalid date.');
        }
    };

    const validateTimelineItem = uniquenessValidator(
        () => (timelineItemStore.getTimelineItemArray.map((item) => item.title)),
        () => (timelineItem?.title),
        'Хронологія з такою назвою вже існує',
    );

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

        onChange('timeline', formValues);
        clearModal();
    };

    const onContextSelect = useCallback((value: string) => {
        const index = historicalContextStore.historicalContextArray.findIndex((c) => c.title === value);
        if (index < 0) {
            if (value.length > MAX_LENGTH.context) {
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
    }, [historicalContextStore, onChange, MAX_LENGTH.context, form, getErrorMessage]);

    const onContextDeselect = useCallback((value: string) => {
        const historicalContext = selectedContext.current.find((x) => x.title === value) as HistoricalContextUpdate;
        if (historicalContext?.isPersisted) {
            historicalContext.modelState = ModelState.Deleted;
        } else {
            selectedContext.current = selectedContext.current.filter((s) => s.title !== value);
        }
        onChange('historicalContexts', selectedContext.current);
    }, [selectedContext, onChange]);

    useEffect(() => {
        if (selectInputContainerRef.current) {
            const notDeletedContextsCount = selectedContext.current.filter((c) => (c as HistoricalContextUpdate).modelState !== ModelState.Deleted).length;
            const input = selectInputContainerRef.current.querySelector('input');
            setSelectContextOpen(notDeletedContextsCount < MAX_CONTEXTS_COUNT);
            if (input) {
                input.disabled = notDeletedContextsCount >= MAX_CONTEXTS_COUNT;
            }
        }
    }, [selectedContext.current.length, open, onContextDeselect, onContextSelect]);

    const handleOk = async () => {
        try {
            await form.validateFields();
            form.submit();
            message.success('Хронологію успішно додано!', 2);
            setIsSaveButtonDisabled(true);
        } catch (error) {
            message.config({
                top: 100,
                duration: 3,
                maxCount: 3,
                prefixCls: 'my-message',
            });
            message.error("Будь ласка, заповніть всі обов'язкові поля та перевірте валідність ваших даних");
        }
    };

    const handleInputChange = () => {
        setIsSaveButtonDisabled(false);
    }

    return (
        <Modal
            className="modalContainer"
            open={open}
            onCancel={() => {
                setIsModalOpen(false);
                setDateTimePickerType('date');
                setIsSaveButtonDisabled(true);
            }}
            footer={null}
            maskClosable
            centered
            closeIcon={(
                <Popover content={POPOVER_CONTENT.CANCEL} trigger="hover">
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
                        rules={[
                            { required: true, message: 'Введіть назву', max: MAX_LENGTH.title },
                            { validator: validateTimelineItem },
                        ]}
                    >
                        <Input
                            maxLength={MAX_LENGTH.title}
                            showCount
							onChange={(e) => {
								onChange('title', e.target.value);
								handleInputChange();
							}}
                            data-testid="input-title"
                        />
                    </Form.Item>

                    <Form.Item>
                        <div className="data-container">
                            <Select
                                options={selectDateOptionsforTimeline}
                                value={dateTimePickerType}
                                onChange={(val) => {
                                    setDateTimePickerType(val);
                                    onChange('date', val);
																		handleInputChange();
                                }}
                                data-testid="select-date"
                            />

                            <Form.Item
                                label="Дата:"
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
                                    onChange={(value) => {
										onChange('date', value?.toString())
										handleInputChange();
									}}
                                    data-testid="date-picker"
                                />
                            </Form.Item>
                        </div>
                    </Form.Item>

                    <div style={{ position: 'relative' }} ref={selectInputContainerRef}>
                        <Form.Item
                            name="historicalContexts"
                            label="Контекст: "
                            validateStatus={errorMessage ? 'error' : ''}
                            help={errorMessage}
                            data-testid="select-context"
                        >
                            <Select
                                mode="tags"
                                {...(!selectContextOpen ? { open: false } : {})}
                                onSelect={onContextSelect}
                                onDeselect={onContextDeselect}
                                onInputKeyDown={onContextKeyDown}
                                value={tagInput}
                                onSearch={handleSearch}
                                onChange={(e) => {
																						onChange('historicalContexts', e);
																						handleInputChange();
																					}}
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
                                {tagInput.length}
                                {' '}
/
                                {' '}
                                {MAX_LENGTH.context}
                            </div>
                        )}
                    </div>

                    <Form.Item
                        name="description"
                        label="Опис: "
                        rules={[{ required: true, message: 'Введіть опис' }]}
                    >
                        <Input.TextArea
                            maxLength={MAX_LENGTH.description}
                            showCount
							onChange={(e) => {
								onChange('description', e.target.value);
								handleInputChange();
							}}
                            data-testid="textarea-description"
                        />

                    </Form.Item>
                    <div className="center">
                        <Button
														disabled={isSaveButtonDisabled}
                            className="streetcode-custom-button"
                            onClick={() => handleOk()}
                            data-testid="button-save"
                        >
                            {BUTTON_LABELS.SAVE}
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
});
export default NewTimelineModal;
