/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
import './MainBlockAdmin.style.scss';

import React, { useEffect, useState } from 'react';
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
  form: FormInstance<any>;
  onChange: (fieldName: string, value: any) => void;
}

const DatePickerPart = React.memo(
    ({ setFirstDate, setSecondDate, form, onChange }: Props) => {
        const [firstDateTimePickerType, setFirstDateTimePickerType] = useState<DatePickerType>(DatePickerType.Date);
        const [secondDateTimePickerType, setSecondDateTimePickerType] = useState<DatePickerType>(DatePickerType.Date);
        const [disableInput, setDisableInput] = useState(true);

        useEffect(() => {
            const dateEntered = form.getFieldValue('streetcodeFirstDate');
            setDisableInput(!dateEntered);
        });

        const updateСroppedDateString = (
            fieldName: string,
            setDateFunction: (date: any) => void,
            extractBeforeIndex = true,
        ) => {
            const dateString = form.getFieldValue('dateString') ?? '';
            const index = dateString.indexOf(' – ');

            const newDateString = extractBeforeIndex
                ? dateString.substring(0, index)
                : dateString.substring(index);

            if (index > 0) {
                form.setFieldValue('dateString', newDateString);
            }
            setDateFunction(null);
            form.setFields([
                {
                    name: fieldName,
                    errors: [],
                },
            ]);
        };

        const onChangeFirstDate = async (date: Dayjs | null | undefined) => {
            if (date) {
                form.setFields([
                    {
                        name: 'dateString',
                        errors: [],
                    },
                ]);
                setFirstDate(date);
                const dateString = form.getFieldValue('dateString') ?? '';
                const index = dateString.indexOf(' – ');

                let newDateString = dateToString(firstDateTimePickerType, date);

                if (index >= 0) {
                    newDateString = newDateString.concat(dateString.substring(index, dateString.length));
                }

                form.setFieldValue('dateString', newDateString);
            } else {
                updateСroppedDateString(
                    'streetcodeFirstDate',
                    setFirstDate,
                    false,
                );
            }

            onChange('streetcodeFirstDate', date);
        };

        const validateDateOrder = (secondDate: Dayjs) => {
            const firstDate = form.getFieldValue('streetcodeFirstDate');

            if (firstDate && secondDate?.isBefore(firstDate)) {
                form.setFields([
                    {
                        name: 'streetcodeSecondDate',
                        errors: ['Ця дата має бути більшою ніж перша'],
                    },
                ]);
            } else {
                form.setFields([
                    {
                        name: 'streetcodeSecondDate',
                        errors: [],
                    },
                ]);
            }
        };

        const onChangeSecondDate = async (date: Dayjs | null | undefined) => {
            if (date) {
                form.setFields([
                    {
                        name: 'dateString',
                        errors: [],
                    },
                ]);
                setSecondDate(date);
                validateDateOrder(date);

                const dateString = form.getFieldValue('dateString') ?? '';
                const index = dateString.indexOf(' – ');

                let newDateString = '';

                if (index >= 0) {
                    newDateString = dateString.substring(0, index);
                }

                newDateString = newDateString.concat(` – ${dateToString(secondDateTimePickerType, date)}`);
                form.setFieldValue('dateString', newDateString);
            } else {
                updateСroppedDateString(
                    'streetcodeSecondDate',
                    setSecondDate,
                );
            }

            onChange('streetcodeSecondDate', date);
        };

        const [dateString, setDateString] = useState('');

        useEffect(() => {
            onChangeFirstDate(form.getFieldValue('streetcodeFirstDate'));
        }, [firstDateTimePickerType]);

        useEffect(() => {
            onChangeSecondDate(form.getFieldValue('streetcodeSecondDate'));
        }, [secondDateTimePickerType]);

        const customFormat: (
            value: Dayjs,
            dateTimePicker: DatePickerType
            ) => string = (value, dateTimePicker) => {
                const yearWithoutLeadingZeros = value.format('YYYY').replace(/^0+/, '');

                if (dateTimePicker === DatePickerType.Date) {
                    return value.format(`D-MMMM-${yearWithoutLeadingZeros}`);
                } if (dateTimePicker === DatePickerType.Year) {
                    return yearWithoutLeadingZeros;
                }

                return value.format(`MMMM-${yearWithoutLeadingZeros}`);
            };

        const changeDateStringHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
            setDateString(e.target.value);
        };

        const changeFirstDateTimePickerTypeHandle = (val: DatePickerType) => {
            setFirstDateTimePickerType(val);
        };

        const changeSecondDateTimePickerTypeHandle = (val: DatePickerType) => {
            setSecondDateTimePickerType(val);
        };

        const placeholderHandle = (dateTimePickerType: DatePickerType) => {
            switch (dateTimePickerType) {
            case DatePickerType.Date:
                return 'dd-mm-yyyy';
            case DatePickerType.Year:
                return 'yyyy';
            default:
                return 'mm-yyyy';
            }
        };

        const pickerHandle = (dateTimePickerType: DatePickerType) => {
            if (dateTimePickerType !== DatePickerType.SeasonYear) {
                return dateTimePickerType;
            }

            return 'month';
        };

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
                                    message:
                                    'Поле може містити лише літери кирилиці, цифри, тире (–) та дужки',
                                },
                            ]}
                        >
                            <Input
                                disabled={disableInput}
                                showCount
                                maxLength={100}
                                onChange={changeDateStringHandle}
                                value={dateString}
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
