import './MainBlockAdmin.style.scss';

import React, { useEffect, useRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { DatePicker, Select } from 'antd';
import { DatePickRef } from 'antd/lib/date-picker/generatePicker/interface';

const DatePickerPart:React.FC<{ firstDate:React.RefObject<Dayjs | null>,
    secondDate:React.RefObject<Dayjs | null> }> = ({ firstDate, secondDate }) => {
        const [dateFirstTimePickerType, setFirstDateTimePickerType] = useState<'date' | 'month' | 'year'>('date');
        const [dateSecondTimePickerType, setSecondDateTimePickerType] = useState<'date' | 'month' | 'year'>('date');
        const [dateString, setDateString] = useState<string>('');

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
            // eslint-disable-next-line no-param-reassign
            firstDate.current = date;
            const index = dateString.indexOf(' - ');
            if (index < 0) {
                setDateString(dateToString(dateFirstTimePickerType, date));
            } else {
                const newString = dateToString(dateFirstTimePickerType, date);
                setDateString(newString.concat(dateString.substring(index, dateString.length)));
            }
        };
        const onChangeSecondDate = (date:Dayjs | null) => {
            // eslint-disable-next-line no-param-reassign
            secondDate.current = date;
            const index = dateString.indexOf(' - ');
            if (index < 0) {
                setDateString(dateString
                    .concat(`${date ? ' - ' : ''} ${dateToString(dateSecondTimePickerType, date)}`));
            } else {
                setDateString(dateString.substring(0, index)
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
                        <DatePicker
                            name="firstDate"
                            onChange={onChangeFirstDate}
                            picker={dateFirstTimePickerType}
                        />
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
                        <DatePicker
                            name="secondDate"
                            onChange={onChangeSecondDate}
                            picker={dateSecondTimePickerType}
                        />
                    </div>

                    <div className="date-string-input">
                        <p>{dateString}</p>
                    </div>

                </div>

            </>
        );
    };
export default DatePickerPart;
