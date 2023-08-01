/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
import './MainBlockAdmin.style.scss';

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Dayjs } from 'dayjs';

import { DatePicker, FormInstance, Input, Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import { dateToString, selectDateOptions } from '@/models/timeline/chronology.model';

interface Props {
    setFirstDate: (newDate: Dayjs | null) => void,
    setSecondDate: (newDate: Dayjs | null) => void,
    form: FormInstance<any>,
    onChange: (fieldName: string, value: any) => void;
}

const DatePickerPart = React.memo(({ setFirstDate, setSecondDate, form, onChange }: Props) => {
    const [dateFirstTimePickerType, setFirstDateTimePickerType] = useState<
        'date' | 'month' | 'year' | 'season-year'>('date');
    const [dateSecondTimePickerType, setSecondDateTimePickerType] = useState<
        'date' | 'month' | 'year' | 'season-year'>('date');
    const capitalize = (text: string): string => {
        if (!text) {
            return text;
        }
        return text[0].toLocaleUpperCase() + text.substring(1, text.length);
    };
    const [disableInput, setDisableInput] = useState(true);
    const { id } = useParams<any>();
    const parseId = id ? +id : null;

    useEffect(() => {
        const dateEntered = form.getFieldValue('streetcodeFirstDate');
        if (dateEntered !== null && dateEntered !== undefined && dateEntered !== '') {
            setDisableInput(false);
        } else {
            setDisableInput(true);
        }
    });

    const onChangeFirstDate = (date: Dayjs | null | undefined) => {
        if (date) {
            setFirstDate(date);
            const dateString = form.getFieldValue('dateString') ?? '';
            const index = dateString.indexOf(' — ');
            if (index < 0) {
                form.setFieldValue('dateString', capitalize(dateToString(dateFirstTimePickerType, date)));
            } else {
                const newString = dateToString(dateFirstTimePickerType, date);
                form.setFieldValue(
                    'dateString',
                    capitalize(newString.concat(dateString.substring(index, dateString.length))),
                );
            }
            onChange('streetcodeFirstDate', date);
        } else {
            const dateString = form.getFieldValue('dateString') ?? '';
            const index = dateString.indexOf(' — ');
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
        if (date && date !== null && date !== undefined) {
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
            const index = dateString.indexOf(' — ');
            if (index < 0) {
                form.setFieldValue(
                    'dateString',
                    dateString
                        .concat(` — ${dateToString(dateSecondTimePickerType, date)}`),
                );
            } else if (date === null || date === undefined) {
                form.setFieldValue('dateString', dateString.substring(0, index));
            } else {
                const newDateString = dateString
                    .substring(0, index).concat(` — ${dateToString(dateSecondTimePickerType, date)}`);
                form.setFieldValue('dateString', newDateString);
            }
            onChange('streetcodeSecondDate', date);
        } else {
            form.setFieldValue('dateString', form.getFieldValue('dateString').split(' — ')[0]);
            setSecondDate(date);
            form.setFields([
                {
                    name: 'streetcodeSecondDate',
                    errors: [],
                },
            ]);
            onChange('streetcodeSecondDate', date);
        }
    };

    return (
        <FormItem label="Роки">
            <div className="date-picker-container">
                <div>
                    <FormItem name="dateString">
                        <Input disabled={disableInput} />
                    </FormItem>
                </div>

                <div className="date-picker-group">
                    <div className="date-picker-group-item">
                        <Select
                            className="date-picker-type-input"
                            options={selectDateOptions}
                            defaultValue={dateFirstTimePickerType}
                            onChange={(val) => {
                                setFirstDateTimePickerType(val);
                                onChangeFirstDate(form.getFieldValue('streetcodeFirstDate'));
                            }}
                        />
                        <FormItem
                            rules={[{ required: !parseId, message: 'Введіть дату' }]}
                            name="streetcodeFirstDate"
                            className="streetcode-first-formitem-datepicker"
                            label=" "
                        >
                            <DatePicker
                                className="streetcode-first-datepicker"
                                onChange={onChangeFirstDate}
                                picker={(dateFirstTimePickerType !== 'season-year')
                                    ? dateFirstTimePickerType : 'month'}
                                format={(dateFirstTimePickerType === 'date'
                                    ? 'D MMMM YYYY'
                                    : dateFirstTimePickerType === 'year'
                                        ? 'YYYY'
                                        : 'YYYY-MMMM')}
                                placeholder={(dateFirstTimePickerType === 'date'
                                    ? 'dd mm yyyy'
                                    : dateFirstTimePickerType === 'year'
                                        ? 'yyyy'
                                        : 'yyyy-mm')}
                            />
                        </FormItem>
                    </div>

                    <div className="date-picker-group-item">
                        <Select
                            className="date-picker-type-input"
                            options={selectDateOptions}
                            defaultValue={dateSecondTimePickerType}
                            onChange={(val) => {
                                setSecondDateTimePickerType(val);
                                onChangeSecondDate(form.getFieldValue('streetcodeSecondDate'));
                            }}
                        />

                        <FormItem
                            name="streetcodeSecondDate"
                            className="my-picker"
                        >
                            <DatePicker
                                onChange={onChangeSecondDate}
                                picker={(dateSecondTimePickerType !== 'season-year')
                                    ? dateSecondTimePickerType : 'month'}
                                format={(dateSecondTimePickerType === 'date'
                                    ? 'D MMMM YYYY'
                                    : dateSecondTimePickerType === 'year'
                                        ? 'YYYY'
                                        : 'YYYY-MMMM')}
                                placeholder={(dateSecondTimePickerType === 'date'
                                    ? 'dd mm yyyy'
                                    : dateSecondTimePickerType === 'year'
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
