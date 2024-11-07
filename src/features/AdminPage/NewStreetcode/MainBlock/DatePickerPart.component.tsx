/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
import './MainBlockAdmin.style.scss';

import React, { useEffect, useState } from 'react';
import { Dayjs } from 'dayjs';

import { DatePicker, FormInstance, Input, Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import { DatePickerType, dateToString, selectDateOptions } from '@/models/timeline/chronology.model';

interface Props {
    setFirstDate: (newDate: Dayjs | null) => void,
    setSecondDate: (newDate: Dayjs | null) => void,
    form: FormInstance<any>,
    onChange: (fieldName: string, value: any) => void;
}

const DatePickerPart = React.memo(({ setFirstDate, setSecondDate, form, onChange }: Props) => {
    const [firstDateTimePickerType, setFirstDateTimePickerType] = useState<DatePickerType>(DatePickerType.Date);
    const [secondDateTimePickerType, setSecondDateTimePickerType] = useState<DatePickerType>(DatePickerType.Date);
    const capitalize = (text: string): string => {
        if (!text) {
            return text;
        }
        return text[0].toLocaleUpperCase() + text.substring(1, text.length);
    };
    const [disableInput, setDisableInput] = useState(true);

    useEffect(() => {
        const dateEntered = form.getFieldValue('streetcodeFirstDate');
        if (dateEntered !== null && dateEntered !== undefined && dateEntered !== '') {
            setDisableInput(false);
        } else {
            setDisableInput(true);
        }
    });

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
            if (index < 0) {
                form.setFieldValue('dateString', capitalize(dateToString(firstDateTimePickerType, date)));
            } else {
                const newString = dateToString(firstDateTimePickerType, date);
                form.setFieldValue(
                    'dateString',
                    capitalize(newString.concat(dateString.substring(index, dateString.length))),
                );
            }
            onChange('streetcodeFirstDate', date);
        } else {
            const dateString = form.getFieldValue('dateString') ?? '';
            const index = dateString.indexOf(' – ');
            if (index > 0) {
                form.setFieldValue('dateString', dateString.substring(index));
            }
            setFirstDate(null);
            form.setFields([
                {
                    name: 'streetcodeSecondDate',
                    errors: [],
                },
            ]);
            onChange('streetcodeFirstDate', date);
        }
    };

    const onChangeSecondDate = (date: Dayjs | null | undefined) => {
        if (date) {
            form.setFields([
                {
                    name: 'dateString',
                    errors: [],
                },
            ]);
            setSecondDate(date);
            const firstDate = form.getFieldValue('streetcodeFirstDate');
            if (firstDate && date && date.isBefore(firstDate)) {
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

            const dateString = form.getFieldValue('dateString') ?? '';
            const index = dateString.indexOf(' – ');
            if (index < 0) {
                form.setFieldValue(
                    'dateString',
                    dateString
                        .concat(` – ${dateToString(secondDateTimePickerType, date)}`),
                );
            } else if (date === null || date === undefined) {
                form.setFieldValue('dateString', dateString.substring(0, index));
            } else {
                const newDateString = dateString
                    .substring(0, index).concat(` – ${dateToString(secondDateTimePickerType, date)}`);
                form.setFieldValue('dateString', newDateString);
            }
            onChange('streetcodeSecondDate', date);
        } else {
            form.setFieldValue('dateString', form.getFieldValue('dateString')?.split(' – ')[0]);
            setSecondDate(null);
            form.setFields([
                {
                    name: 'streetcodeSecondDate',
                    errors: [],
                },
            ]);
            onChange('streetcodeSecondDate', date);
        }
    };

    const [dateString, setDateString] = useState('');

    useEffect(() => {
        onChangeFirstDate(form.getFieldValue('streetcodeFirstDate'));
    }, [firstDateTimePickerType]);

    useEffect(() => {
        onChangeSecondDate(form.getFieldValue('streetcodeSecondDate'));
    }, [secondDateTimePickerType]);

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
                            onChange={(e) => setDateString(e.target.value)}
                            value={dateString}
                        />
                    </FormItem>
                </div>

                <div className="date-picker-group">
                    <div className="date-picker-group-item">
                        <Select
                            data-testid="firstDateType"
                            className="date-picker-type-input"
                            options={selectDateOptions}
                            defaultValue={firstDateTimePickerType}
                            onChange={(val) => {
                                setFirstDateTimePickerType(val);
                            }}
                        />
                        <FormItem
                            name="streetcodeFirstDate"
                            label=" "
                            className="streetcode-first-formitem-datepicker"
                            rules={[{ required: true, message: 'Введіть дату' }]}
                        >
                            <DatePicker
                                className="streetcode-first-datepicker"
                                onChange={onChangeFirstDate}
                                picker={(firstDateTimePickerType !== 'season-year')
                                    ? firstDateTimePickerType : 'month'}
                                format={(firstDateTimePickerType === 'date'
                                    ? 'D-MMMM-YYYY'
                                    : firstDateTimePickerType === 'year'
                                        ? 'YYYY'
                                        : 'YYYY-MMMM')}
                                placeholder={(firstDateTimePickerType === 'date'
                                    ? 'dd-mm-yyyy'
                                    : firstDateTimePickerType === 'year'
                                        ? 'yyyy'
                                        : 'yyyy-mm')}
                            />
                        </FormItem>
                    </div>

                    <div className="date-picker-group-item">
                        <Select
                            data-testid="secondDateType"
                            className="date-picker-type-input"
                            options={selectDateOptions}
                            defaultValue={secondDateTimePickerType}
                            onChange={(val) => {
                                setSecondDateTimePickerType(val);
                            }}
                        />

                        <FormItem
                            name="streetcodeSecondDate"
                            className="my-picker"
                        >
                            <DatePicker
                                onChange={onChangeSecondDate}
                                picker={(secondDateTimePickerType !== 'season-year')
                                    ? secondDateTimePickerType : 'month'}
                                format={(secondDateTimePickerType === 'date'
                                    ? 'D-MMMM-YYYY'
                                    : secondDateTimePickerType === 'year'
                                        ? 'YYYY'
                                        : 'YYYY-MMMM')}
                                placeholder={(secondDateTimePickerType === 'date'
                                    ? 'dd-mm-yyyy'
                                    : secondDateTimePickerType === 'year'
                                        ? 'yyyy'
                                        : 'yyyy-mm')}
                            />
                        </FormItem>
                    </div>
                </div>
            </div>
        </FormItem>
    );
});
export default DatePickerPart;
