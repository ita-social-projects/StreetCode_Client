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
    isFirstDateRequired?:boolean,
    isSecondDateRequired?:boolean,
    form:FormInstance<any>
}> = ({
    setFirstDate, setSecondDate, isFirstDateRequired, isSecondDateRequired, form,
}) => {
    const [dateFirstTimePickerType, setFirstDateTimePickerType] = useState<'date' | 'month' | 'year'>('date');
    const [dateSecondTimePickerType, setSecondDateTimePickerType] = useState<'date' | 'month' | 'year'>('date');

    const [seasonFirstVisible, setSeasonFirstVisible] = useState<boolean>(false);
    const [seasonSecondVisible, setSeasonSecondisible] = useState<boolean>(false);
    const selectDateOptions = [{
        value: 'date',
        label: 'День/місяць/рік',
    },
    {
        value: 'month',
        label: 'Місяць/рік',
    },
    {
        value: 'year',
        label: 'Рік',
    },
    {
        value: 'year',
        label: 'Пора/рік',
    },
    ];

    const dateToString = (typeDate:'date' | 'month' | 'year', date: Dayjs | null):string => {
        if (!date) {
            return '';
        }
        if (typeDate === 'date') {
            return date.format('D MMMM YYYY');
        }
        if (typeDate === 'month') {
            return date.format('MMMM YYYY');
        }
        if (typeDate === 'year') {
            return date.format('YYYY');
        }
        return '';
    };

    const onChangeFirstDate = (date:Dayjs | null) => {
        setFirstDate(date);
        const dateString = form.getFieldValue('dateString') ?? '';
        const index = dateString.indexOf(' - ');
        if (index < 0) {
            form.setFieldValue('dateString', dateToString(dateFirstTimePickerType, date));
        } else {
            const newString = dateToString(dateFirstTimePickerType, date);
            form.setFieldValue('dateString', newString.concat(dateString.substring(index, dateString.length)));
        }
    };

    const onChangeSecondDate = (date:Dayjs | null) => {
        setSecondDate(date);
        const dateString = form.getFieldValue('dateString') ?? '';
        const index = dateString.indexOf(' - ');
        if (index < 0) {
            form.setFieldValue('dateString', dateString
                .concat(`${date ? ' - ' : ''} ${dateToString(dateSecondTimePickerType, date)}`));
        } else {
            form.setFieldValue('dateString', dateString.substring(0, index)
                .concat(`${date ? ' - ' : ''} ${dateToString(dateSecondTimePickerType, date)}`));
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
                        }}
                    />
                    <FormItem
                        rules={[{ required: true, message: 'Введіть дату' }]}
                        name="streetcodeFirstDate"
                    >
                        <DatePicker
                            onChange={onChangeFirstDate}
                            picker={dateFirstTimePickerType}
                        />
                    </FormItem>
                </div>

                <div className="date-picker-qroup-item">
                    <Select
                        className="date-picker-type-input"
                        options={selectDateOptions}
                        defaultValue={dateSecondTimePickerType}
                        onChange={(val) => {
                            setSecondDateTimePickerType(val);
                        }}
                    />
                    <FormItem required={isSecondDateRequired} name="streetcodeSecondDate">
                        <DatePicker
                            onChange={onChangeSecondDate}
                            picker={dateSecondTimePickerType}
                        />
                    </FormItem>
                </div>

                <div className="date-string-input">

                    <FormItem name="dateString">
                        <Input />
                    </FormItem>
                </div>

            </div>

        </>
    );
};
export default DatePickerPart;
