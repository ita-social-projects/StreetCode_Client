/* eslint-disable complexity,react/prop-types,max-len */
import './MainBlockAdmin.style.scss';

import React, { useCallback, useEffect, useState } from 'react';
import { Dayjs } from 'dayjs';

import { DatePicker, FormInstance, Input, Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import {
    DatePickerType,
    dateToString,
    selectDateOptions,
} from '@/models/timeline/chronology.model';

interface Props {
    setFirstDate: (newDate: Dayjs | null) => void;
    setSecondDate: (newDate: Dayjs | null) => void;
    form: FormInstance;
    onChange: (fieldName: string, value: Dayjs | null) => void;
}

const DatePickerPart: React.FC<Props> = React.memo(
    ({ setFirstDate, setSecondDate, form, onChange }) => {
        const [firstDateTimePickerType, setFirstDateTimePickerType] = useState<DatePickerType>(DatePickerType.Date);
        const [secondDateTimePickerType, setSecondDateTimePickerType] = useState<DatePickerType>(DatePickerType.Date);
        const [disableInput, setDisableInput] = useState(true);

        const updateDateString = useCallback(() => {
            const firstDate = form.getFieldValue('streetcodeFirstDate') as Dayjs | null;
            const secondDate = form.getFieldValue('streetcodeSecondDate') as Dayjs | null;

            let newDateString = '';
            if (firstDate) {
                newDateString = dateToString(firstDateTimePickerType, firstDate);
            }
            if (secondDate) {
                const secondDateStr = dateToString(secondDateTimePickerType, secondDate);
                newDateString = firstDate
                    ? `${newDateString} – ${secondDateStr}`
                    : secondDateStr;
            }

            form.setFieldValue('dateString', newDateString);
            form.setFields([{ name: 'dateString', errors: [] }]);
        }, [firstDateTimePickerType, secondDateTimePickerType, form]);

        const onChangeFirstDate = useCallback(
            async (date: Dayjs | null) => {
                setFirstDate(date);
                setDisableInput(!date);
                onChange('streetcodeFirstDate', date);

                if (!date) {
                    form.setFieldValue('streetcodeFirstDate', null);
                    if (!form.getFieldValue('streetcodeSecondDate')) {
                        form.setFieldValue('dateString', '');
                    } else {
                        updateDateString();
                    }
                    return;
                }

                updateDateString();
            },
            [setFirstDate, onChange, form, updateDateString],
        );

        const validateDateOrder = useCallback(
            (secondDate: Dayjs) => {
                const firstDate = form.getFieldValue('streetcodeFirstDate') as Dayjs | null;
                if (firstDate && secondDate?.isBefore(firstDate)) {
                    form.setFields([
                        { name: 'streetcodeSecondDate', errors: ['Ця дата має бути більшою ніж перша'] },
                    ]);
                } else {
                    form.setFields([{ name: 'streetcodeSecondDate', errors: [] }]);
                }
            },
            [form],
        );

        const onChangeSecondDate = useCallback(
            async (date: Dayjs | null) => {
                setSecondDate(date);
                onChange('streetcodeSecondDate', date);

                if (!date) {
                    form.setFieldValue('streetcodeSecondDate', null);
                    updateDateString();
                    return;
                }

                validateDateOrder(date);
                updateDateString();
            },
            [setSecondDate, onChange, validateDateOrder, form, updateDateString],
        );

        useEffect(() => {
            const firstDate = form.getFieldValue('streetcodeFirstDate');
            if (firstDate) {
                updateDateString();
            }
        }, [firstDateTimePickerType, updateDateString, form]);

        useEffect(() => {
            const secondDate = form.getFieldValue('streetcodeSecondDate');
            if (secondDate) {
                updateDateString();
            }
        }, [secondDateTimePickerType, updateDateString, form]);

        const customFormat = useCallback(
            (value: Dayjs, dateTimePicker: DatePickerType): string => {
                const yearWithoutLeadingZeros = value.format('YYYY').replace(/^0+/, '');
                switch (dateTimePicker) {
                case DatePickerType.Date:
                    return value.format(`D-MMMM-${yearWithoutLeadingZeros}`);
                case DatePickerType.Year:
                    return yearWithoutLeadingZeros;
                default:
                    return value.format(`MMMM-${yearWithoutLeadingZeros}`);
                }
            },
            [],
        );

        const changeFirstDateTimePickerTypeHandle = (val: DatePickerType) => {
            setFirstDateTimePickerType(val);
        };

        const changeSecondDateTimePickerTypeHandle = (val: DatePickerType) => {
            setSecondDateTimePickerType(val);
        };

        const placeholderHandle = (dateTimePickerType: DatePickerType): string => {
            switch (dateTimePickerType) {
            case DatePickerType.Date:
                return 'dd-mm-yyyy';
            case DatePickerType.Year:
                return 'yyyy';
            default:
                return 'mm-yyyy';
            }
        };

        const pickerHandle = (dateTimePickerType: DatePickerType) => (dateTimePickerType === DatePickerType.SeasonYear ? 'month' : dateTimePickerType);

        return (
            <FormItem label="Роки">
                <div className="date-picker-container">
                    <div>
                        <FormItem
                            name="dateString"
                            validateFirst
                            rules={[
                                {
                                    required: true,
                                    message: 'Поле не може бути порожнім',
                                },
                                {
                                    pattern: /^[0-9()а-яА-Яі– ]+$/u,
                                    message: 'Поле може містити лише літери кирилиці, цифри, тире (–) та дужки',
                                },
                            ]}
                        >
                            <Input
                                disabled={disableInput}
                                showCount
                                maxLength={100}
                            />
                        </FormItem>
                    </div>

                    <div className="date-picker-group">
                        <div className="date-picker-group-item">
                            <Select
                                className="date-picker-type-input"
                                options={selectDateOptions}
                                defaultValue={firstDateTimePickerType}
                                onChange={changeFirstDateTimePickerTypeHandle}
                            />
                            <FormItem
                                rules={[{ required: true, message: 'Введіть дату' }]}
                                name="streetcodeFirstDate"
                                className="streetcode-first-formitem-datepicker"
                                label=" "
                            >
                                <DatePicker
                                    className="streetcode-first-datepicker"
                                    onChange={onChangeFirstDate}
                                    picker={pickerHandle(firstDateTimePickerType)}
                                    format={(date) => customFormat(date, firstDateTimePickerType)}
                                    placeholder={placeholderHandle(firstDateTimePickerType)}
                                />
                            </FormItem>
                        </div>

                        <div className="date-picker-group-item">
                            <Select
                                className="date-picker-type-input"
                                options={selectDateOptions}
                                defaultValue={secondDateTimePickerType}
                                onChange={changeSecondDateTimePickerTypeHandle}
                            />
                            <FormItem name="streetcodeSecondDate" className="my-picker">
                                <DatePicker
                                    onChange={onChangeSecondDate}
                                    picker={pickerHandle(secondDateTimePickerType)}
                                    format={(date) => customFormat(date, secondDateTimePickerType)}
                                    placeholder={placeholderHandle(secondDateTimePickerType)}
                                />
                            </FormItem>
                        </div>
                    </div>
                </div>
            </FormItem>
        );
    },
);

export default DatePickerPart;
