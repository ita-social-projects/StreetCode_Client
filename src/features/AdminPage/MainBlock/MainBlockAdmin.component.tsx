import './MainBlockAdmin.style.scss';

import React, { useEffect, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

import {
    DatePicker, Form, Input, InputNumber, Select, Space, Switch, Upload, UploadFile,
} from 'antd';
import ukUAlocaleDatePicker from 'antd/es/date-picker/locale/uk_UA';
import Dragger from 'antd/es/upload/Dragger';

import TagsApi from '@/app/api/additional-content/tags.api';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import Tag, { TagVisible } from '@/models/additional-content/tag.model';

import DragableTags from './DragableTags/DragableTags.component';

const { Option } = Select;
const MainBlockAdmin: React.FC = () => {
    const [selectedTags, setSelectedTags] = useState<TagVisible[]>([]);
    const allTags = useAsync(() => TagsApi.getAll()).value;
    const [tags, setTags] = useState< Tag[]>([]);
    const [dateTimePickerType, setDateTimePickerType] = useState<'date' | 'month' | 'year'>('date');
    const [dateString, setDateString] = useState<string>('');
    const [leftCharForInput, setLeftCharForInput] = useState<number>(450);
    const [streetcodeType, setStreetcodeType] = useState<'people' | 'event'>('people');
    const [fileList, setFileList] = useState<UploadFile[]>();

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList);

    const onSwitchChange = (value:boolean) => {
        if (value) {
            setStreetcodeType('event');
        } else {
            setStreetcodeType('people');
        }
    };
    const onTextAreaTeaserChange = (e) => {
        const text = e.target.value;
        setLeftCharForInput(450 - text.length - (text.match(/(\n|\r)/gm) || []).length * 49);
    };
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

    useEffect(() => {
        if (allTags) {
            const returnedTags = allTags as Tag[];
            /*  returnedTags.push(
                { id: 101, title: 'first' },
                { id: 20, title: 'second' },
                { id: 31, title: 'third' },
                { id: 121, title: 'first2' },
                { id: 23, title: 'seco3nd' },
                { id: 34, title: 'thi4rd' },
            ); */
            setTags(returnedTags);
        }
    }, [allTags]);

    const onSelectTag = (selectedValue: string) => {
        let selected;
        const selectedIndex = tags.findIndex((t) => t.title === selectedValue);
        if (selectedIndex < 0) {
            const newId = Math.max(...selectedTags.map((t) => t.id));
            selected = { id: newId, title: selectedValue };
            setTags([...tags, selected]);
        } else {
            selected = tags[selectedIndex];
        }

        setSelectedTags([...selectedTags, { ...selected, visible: false }]);
    };

    const onDeselectTag = (deselectedValue:string) => {
        setSelectedTags(selectedTags.filter((t) => t.title !== deselectedValue));
    };

    const dateToString = (typeDate:'date' | 'month' | 'year', date: Dayjs):string => {
        dayjs.locale('ua');
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

    const onChangeFirstDate = (date) => {
        const index = dateString.indexOf(' - ');
        if (index < 0) {
            setDateString(dateToString(dateTimePickerType, date));
        } else {
            const newString = dateToString(dateTimePickerType, date);
            setDateString(newString.concat(dateString.substring(index, dateString.length)));
        }
    };

    const onChangeSecondDate = (date) => {
        const index = dateString.indexOf(' - ');
        if (index < 0) {
            setDateString(dateString.concat(` - ${dateToString(dateTimePickerType, date)}`));
        } else {
            setDateString(dateString.substring(0, index).concat(` - ${dateToString(dateTimePickerType, date)}`));
        }
    };
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj as RcFile);
        }
    
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
      };
    dayjs.locale('uk');
    const dayJsUa = require("dayjs/locale/uk"); // eslint-disable-line
    ukUAlocaleDatePicker.lang.shortWeekDays = dayJsUa.weekdaysShort;
    ukUAlocaleDatePicker.lang.shortMonths = dayJsUa.monthsShort;
    return (
        <Form layout="vertical" className="mainblock-add-form">
            <>
                Постать
                <Switch className="person-event-switch" onChange={onSwitchChange} />
                Подія
                <Form.Item label="Номер стріткоду">
                    <InputNumber min={0} />
                </Form.Item>
                {streetcodeType === 'people' ? (
                    <Input.Group compact className="maincard-input people-title-group">
                        <Form.Item label="Прізвище" className="people-title-input">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Ім'я" className="people-title-input">
                            <Input />
                        </Form.Item>

                    </Input.Group>
                )
                    : ('')}
                <Form.Item label="Назва події" className="maincard-input event-title-input">
                    <Input />
                </Form.Item>
                <p>Роки життя/Дата або період події</p>
                <Select
                    className="maincard-input"
                    options={selectDateOptions}
                    onChange={(val) => {
                        setDateTimePickerType(val);
                    }}
                />
                <div className="date-picker-qroup">
                    <Form.Item>
                        <DatePicker
                            name="firstDate"
                            onChange={onChangeFirstDate}
                            picker={dateTimePickerType}
                        />
                    </Form.Item>
                    <Space direction="horizontal" />
                    <Form.Item>
                        <DatePicker
                            name="secondDate"
                            onChange={onChangeSecondDate}
                            picker={dateTimePickerType}
                        />
                    </Form.Item>
                    <div className="date-string-input">
                        <p>{dateString}</p>
                    </div>
                </div>

                <p>Теги:</p>
                <DragableTags setTags={setSelectedTags} tags={selectedTags} />
                <Select
                    className="tags-select-input maincard-input"
                    mode="tags"
                    onSelect={onSelectTag}
                    onDeselect={onDeselectTag}
                >
                    {tags.map((t) => <Option key={t.id} value={t.title} label={t.title} />)}
                </Select>
                <Form.Item
                    className="maincard-input teaser-input"
                    label="Тизер"
                    rules={[{ required: true, message: 'Введіть тизер...' }]}
                >
                    <Input.TextArea onChange={onTextAreaTeaserChange} className="textarea-teaser" maxLength={450} />
                    <p className="amount-left-char-textarea-teaser">{leftCharForInput}</p>
                </Form.Item>

                <Form.Item
                    className="maincard-input"
                    label="Анімація"
                >
                    <Upload
                        onPreview={handlePreview}
                        listType="picture-card"
                        multiple={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    >
                        <InboxOutlined />
                        <p className="ant-upload-text">Виберіть чи перетягніть файл</p>
                    </Upload>
                </Form.Item>

                <Form.Item
                    className="maincard-input"
                    label="Зображення"
                >
                    <Upload multiple listType="picture-card">
                        <InboxOutlined />
                        <p className="ant-upload-text">Виберіть чи перетягніть файл</p>
                    </Upload>
                </Form.Item>

                <Form.Item
                    className="maincard-input"
                    label="Аудіо"
                >
                    <Dragger>
                        <InboxOutlined />
                        <p className="ant-upload-text">Виберіть чи перетягніть файл</p>
                    </Dragger>
                </Form.Item>
            </>
        </Form>
    );
};
export default MainBlockAdmin;
