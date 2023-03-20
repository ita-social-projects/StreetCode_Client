import './MainBlockAdmin.style.scss';

import React, { useEffect, useRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import {
    DatePicker, FormInstance, Input, InputRef, Select,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';

const DatePickerPart:React.FC<{
    setFirstDate:(newDate: Dayjs | null) => void,
    setSecondDate:(newDate: Dayjs | null) => void,
    form:FormInstance<any>
}> = ({ setFirstDate, setSecondDate, form }) => {
    const [dateFirstTimePickerType, setFirstDateTimePickerType] = useState<
    'date' | 'month' | 'year' | 'season-year'>('date');
    const [dateSecondTimePickerType, setSecondDateTimePickerType] = useState<
    'date' | 'month' | 'year' | 'season-year'>('date');

    const selectDateOptions = [{
        value: 'date',
        label: 'День/місяць/рік',
    }, {
        value: 'month',
        label: 'Місяць/рік',
    }, {
        value: 'year',
        label: 'Рік',
    }, {
        value: 'season-year',
        label: 'Пора/рік',
    }];

    const getSeason = (date: Dayjs | null): string => {
        if (!date) {
            return '';
        }
        const month = date.month();
        if (month < 2 || month === 11) {
            return 'зима';
        }
        if (month >= 2 && month < 5) {
            return 'весна';
        }
        if (month >= 5 && month < 8) {
            return 'літо';
        }
        return 'осінь';
    };

    const dateToString = (typeDate:'date' | 'month' | 'year' | 'season-year', date: Dayjs | null):string => {
        if (!date) {
            return '';
        }
        if (typeDate === 'date') {
            return date.format('D MMMM YYYY');
        }
        if (typeDate === 'month') {
            return date.format('MMMM YYYY');
        }
        const year = date.format('YYYY');
        if (typeDate === 'year') {
            return year;
        }
        return `${getSeason(date)} ${year}`;
    };
    const capitalize = (text:string):string => {
        if (!text) {
            return text;
        }
        return text[0].toLocaleUpperCase() + text.substring(1, text.length);
    };

    const onChangeFirstDate = (date:Dayjs | null) => {
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
    };

    const onChangeSecondDate = (date:Dayjs | null) => {
        setSecondDate(date);
        const dateString = form.getFieldValue('dateString') ?? '';
        const index = dateString.indexOf(' — ');
        if (index < 0) {
            form.setFieldValue('dateString', dateString
                .concat(`${date ? ' — ' : ''} ${dateToString(dateSecondTimePickerType, date)}`));
        } else {
            form.setFieldValue('dateString', dateString.substring(0, index)
                .concat(`${date ? ' — ' : ''} ${dateToString(dateSecondTimePickerType, date)}`));
        }
    };

    return (
        <>
            <p>Роки життя/Дата або період події</p>
            <div className="date-picker-qroup">

                <div className="date-picker-qroup-item">
                    <Select
                        className="date-picker-type-input"
                        options={selectDateOptions}
                        defaultValue={dateFirstTimePickerType}
                        onChange={(val) => {
                            setFirstDateTimePickerType(val);
                            onChangeFirstDate(form.getFieldValue('streetcodeFirstDate'));
                        }}
                    />
                    <div>
                        <FormItem
                            rules={[{ required: true, message: 'Введіть дату' }]}
                            name="streetcodeFirstDate"
                        >
                            <DatePicker
                                onChange={onChangeFirstDate}
                                picker={(dateFirstTimePickerType !== 'season-year') ? dateFirstTimePickerType : 'month'}
                            />
                        </FormItem>
                    </div>

                </div>

                <div className="date-picker-qroup-item">
                    <Select
                        className="date-picker-type-input"
                        options={selectDateOptions}
                        defaultValue={dateSecondTimePickerType}
                        onChange={(val) => {
                            setSecondDateTimePickerType(val);
                            onChangeSecondDate(form.getFieldValue('streetcodeSecondDate'));
                        }}
                    />

                    <FormItem name="streetcodeSecondDate">
                        <DatePicker
                            onChange={onChangeSecondDate}
                            picker={(dateSecondTimePickerType !== 'season-year') ? dateSecondTimePickerType : 'month'}
                        />
                    </FormItem>
                </div>

                <div className="date-string-input">

                    <FormItem name="dateString">
                        <Input disabled />
                    </FormItem>
                </div>

            </div>

        </>
    );
};
export default DatePickerPart;
