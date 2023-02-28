import './MainBlockAdmin.style.scss';

import React, { useEffect, useRef, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

import {
    Form, Input, InputNumber, InputRef, Select, Switch, Upload, UploadFile,
} from 'antd';
import ukUAlocaleDatePicker from 'antd/es/date-picker/locale/uk_UA';
import Dragger from 'antd/es/upload/Dragger';

import TagsApi from '@/app/api/additional-content/tags.api';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import Tag, { TagVisible } from '@/models/additional-content/tag.model';

import DragableTags from './DragableTags/DragableTags.component';
import PreviewFileModal from './PreviewFileModal/PreviewFileModal.component';
import DatePickerPart from './DatePickerPart.component';

const { Option } = Select;
const MainBlockAdmin: React.FC = () => {
    const allTags = useAsync(() => TagsApi.getAll()).value;
    const [selectedTags, setSelectedTags] = useState<TagVisible[]>([]);
    const [tags, setTags] = useState< Tag[]>([]);
    const [leftCharForInput, setLeftCharForInput] = useState<number>(450);
    const [streetcodeType, setStreetcodeType] = useState<'people' | 'event'>('people');

    const [previewOpen, setPreviewOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);

    const name = useRef<InputRef>(null);
    const surname = useRef<InputRef>(null);
    const [stretcodeTitle, setStreetcodeTitle] = useState<string>();
    const firstDate = useRef<Dayjs>(null);
    const secondDate = useRef<Dayjs>(null);

    const onNameSurnameChange = () => {
        const curname = name.current?.input?.value;
        setStreetcodeTitle(`${surname.current?.input?.value}${curname ? ` ${curname}` : ''}`);
    };
    const onSwitchChange = (value:boolean) => {
        if (value) {
            setStreetcodeType('event');
        } else {
            setStreetcodeType('people');
        }
    };
    const onTextAreaTeaserChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setLeftCharForInput(450 - text.length - (text.match(/(\n|\r)/gm) || []).length * 49);
    };

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

    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
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
                            <Input
                                ref={surname}
                                onChange={onNameSurnameChange}
                            />
                        </Form.Item>
                        <Form.Item label="Ім'я" className="people-title-input">
                            <Input ref={name} onChange={onNameSurnameChange} />
                        </Form.Item>
                    </Input.Group>
                )
                    : ('')}

                <Form.Item label="Назва стріткоду" className="maincard-input stretcode-title-input">
                    <Input
                        value={stretcodeTitle}
                        onChange={(e) => {
                            setStreetcodeTitle(e.target.value);
                        }}
                    />
                </Form.Item>

                <DatePickerPart firstDate={firstDate} secondDate={secondDate} />

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
                        listType="picture-card"
                        multiple={false}
                        maxCount={1}
                        onPreview={handlePreview}
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
                    <Upload
                        multiple
                        listType="picture-card"
                        onPreview={handlePreview}
                    >
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
                <PreviewFileModal file={filePreview} opened={previewOpen} setOpened={setPreviewOpen} />
            </>
        </Form>
    );
};
export default MainBlockAdmin;
