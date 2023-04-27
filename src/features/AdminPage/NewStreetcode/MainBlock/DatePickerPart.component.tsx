import './MainBlockAdmin.style.scss';

import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { DatePicker, FormInstance, Input, Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { useParams } from 'react-router-dom';

import { dateToString, selectDateOptions } from '@/models/timeline/chronology.model';
import StreetcodesApi from '../../../../app/api/streetcode/streetcodes.api';

const DatePickerPart:React.FC<{
    setFirstDate:(newDate: Dayjs | null) => void,
    setSecondDate:(newDate: Dayjs | null) => void,
    form:FormInstance<any>
}> = ({ setFirstDate, setSecondDate, form }) => {
    const [dateFirstTimePickerType, setFirstDateTimePickerType] = useState<
    'date' | 'month' | 'year' | 'season-year'>('date');
    const [dateSecondTimePickerType, setSecondDateTimePickerType] = useState<
    'date' | 'month' | 'year' | 'season-year'>('date');
    const capitalize = (text:string):string => {
        if (!text) {
            return text;
        }
        return text[0].toLocaleUpperCase() + text.substring(1, text.length);
    };

    const { id } = useParams<any>();
    const parseId = id ? +id : null;
    const [defaultFirstDate, setDefaultFirtsDate] = useState<string>();
    const [defaultSecondDate, setDefaultSecondDate] = useState<string>();
    const [defaultDate, setDefaultDate] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        if (parseId) {
            const fetchData = async () => {
                try {
                    const x = await StreetcodesApi.getById(parseId);
                    setDefaultFirtsDate(x.eventStartOrPersonBirthDate.toString() ?? "");
                    setDefaultSecondDate(x.eventEndOrPersonDeathDate.toString() ?? "");
                    setDefaultDate(x.dateString ?? "");
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
        else { setIsLoading(false); }
    }, [parseId]);

    const onChangeFirstDate = (date: Dayjs | null) => {
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

    const onChangeSecondDate = (date: Dayjs | null) => {
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
        <FormItem label="Роки Діяльності">         
            {
                isLoading ? (
                <div>Loading...</div>
            ) : 
            (
            <div className='date-picker-container'>
                <div className="date-string-input">
                    <FormItem name="dateString">
                        <Input defaultValue={defaultDate} disabled />
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
                            rules={[{ required: parseId ? false : true, message: 'Введіть дату' }]}
                            name="streetcodeFirstDate"
                            className='my-picker'
                        >
                            <DatePicker
                                defaultValue={defaultFirstDate ? dayjs(defaultFirstDate) : null}
                                onChange={onChangeFirstDate}
                                picker={(dateFirstTimePickerType !== 'season-year') ? dateFirstTimePickerType : 'month'}
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
                                setDefaultSecondDate(val);
                            }}
                        />

                        <FormItem 
                            rules={[{ required: parseId ? false : true, message: 'Введіть дату' }]}
                            name="streetcodeSecondDate"
                            className='my-picker'>
                            <DatePicker
                                defaultValue={defaultSecondDate ? dayjs(defaultSecondDate) : null}
                                value={defaultSecondDate ? dayjs(defaultSecondDate) : null}
                                onChange={onChangeSecondDate}
                                picker={(dateSecondTimePickerType !== 'season-year') ? dateSecondTimePickerType : 'month'}
                            />
                        </FormItem>
                    </div>
                </div>   
            </div>
           )}
        </FormItem>
    );
};
export default DatePickerPart;
