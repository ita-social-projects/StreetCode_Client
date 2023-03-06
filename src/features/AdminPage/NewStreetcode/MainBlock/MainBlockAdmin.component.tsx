import './MainBlockAdmin.style.scss';

import React, { useEffect, useRef, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

import {
    Button,
    Form, Input, InputNumber, InputRef, Popover, Select, Switch, Upload, UploadFile,
} from 'antd';
import ukUAlocaleDatePicker from 'antd/es/date-picker/locale/uk_UA';
import Dragger from 'antd/es/upload/Dragger';

import TagsApi from '@/app/api/additional-content/tags.api';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import Tag, { TagVisible } from '@/models/additional-content/tag.model';

import DragableTags from './DragableTags/DragableTags.component';
import PopoverForTagContent from './PopoverForTagContent/PopoverForTagContent.component';
import PreviewFileModal from './PreviewFileModal/PreviewFileModal.component';
import DatePickerPart from './DatePickerPart.component';

const { Option } = Select;
const MainBlockAdmin: React.FC = () => {
    const allTags = useAsync(() => TagsApi.getAll()).value;
    const [selectedTags, setSelectedTags] = useState<TagVisible[]>([]);
    const [tags, setTags] = useState< Tag[]>([]);
    const [leftCharForInput, setLeftCharForInput] = useState<number>(450);
    const [streetcodeType, setStreetcodeType] = useState<'people' | 'event'>('people');
    const [maxCharCount, setMaxCharCount] = useState<number>(450);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const [popoverProps, setPopoverProps] = useState<{
        width:number, screenWidth:number }>({ width: 360, screenWidth: 360 });

    const name = useRef<InputRef>(null);
    const surname = useRef<InputRef>(null);
    const [streetcodeTitle, setStreetcodeTitle] = useState<string>('');
    const [streetcodeTeaser, setStreetcodeTeaser] = useState<string>('');
    const firstDate = useRef<Dayjs | null>(null);
    const secondDate = useRef<Dayjs | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldValue('title', streetcodeTitle);
    }, [streetcodeTitle]);
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
        const newLinesCharCount = (text.match(/(\n|\r)/gm) || []).length;
        const newLeftCharForInput = 450 - text.length - newLinesCharCount * 49;
        if (newLeftCharForInput < 0) {
            return;
        }
        setStreetcodeTeaser(text);

        if (maxCharCount !== 450 - newLinesCharCount * 49) {
            setMaxCharCount(450 - newLinesCharCount * 49);
        }
        setLeftCharForInput(newLeftCharForInput);
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

    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <Form
            form={form}
            layout="vertical"
            className="mainblock-add-form"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <>
                Постать
                <Switch className="person-event-switch" onChange={onSwitchChange} />
                Подія

                <Form.Item
                    label="Номер стріткоду"
                    rules={[{ required: true, message: 'Введіть номер стріткоду' }]}
                    name="streetcodeNumber"
                >
                    <InputNumber min={0} />
                </Form.Item>

                {streetcodeType === 'people' ? (
                    <Input.Group
                        compact
                        className="maincard-item people-title-group"
                    >
                        <Form.Item name="surname" label="Прізвище" className="people-title-input">
                            <Input
                                ref={surname}
                                onChange={onNameSurnameChange}
                            />
                        </Form.Item>
                        <Form.Item label="Ім'я" name="name" className="people-title-input">
                            <Input ref={name} onChange={onNameSurnameChange} />
                        </Form.Item>
                    </Input.Group>
                )
                    : ('')}

                <Form.Item
                    name="title"
                    label="Назва стріткоду"
                    className="maincard-item"
                    rules={[{ required: true, message: 'Введіть назву стріткоду', max: 100 }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="Короткий опис" className="maincard-item">
                    <Input />
                </Form.Item>

                <DatePickerPart
                    form={form}
                    setFirstDate={(newDate:Dayjs | null) => {
                        firstDate.current = newDate;
                    }}
                    setSecondDate={(newDate:Dayjs | null) => {
                        secondDate.current = newDate;
                    }}
                />

                <p>Теги:</p>
                <div className="tags-block">
                    <div className="tags-block-tagitems">
                        <DragableTags setTags={setSelectedTags} tags={selectedTags} />

                        <Select
                            className="tags-select-input"
                            mode="tags"
                            onSelect={onSelectTag}
                            onDeselect={onDeselectTag}
                        >
                            {tags.map((t) => <Option key={t.id} value={t.title} label={t.title} />)}
                        </Select>
                    </div>
                    <div className="device-sizes-list">
                        <Popover
                            content={(
                                <PopoverForTagContent
                                    screenWidth={popoverProps.screenWidth}
                                    tags={selectedTags}
                                />
                            )}
                            title=""
                            trigger="hover"
                            overlayStyle={{ width: popoverProps.width }}
                        >
                            <p
                                className="device-size"
                                onMouseEnter={() => setPopoverProps({ screenWidth: 360, width: 360 })}
                            >
                                360
                            </p>
                            <p
                                className="device-size"
                                onMouseEnter={() => setPopoverProps({ screenWidth: 1600, width: 612 })}
                            >
                                1600
                            </p>
                        </Popover>
                    </div>

                </div>

                <Form.Item
                    className="maincard-item teaser-form-item"
                    label="Тизер"
                    rules={[{ required: true, message: 'Введіть тизер' }]}
                >
                    <Input.TextArea
                        onChange={onTextAreaTeaserChange}
                        className="textarea-teaser"
                        maxLength={maxCharCount}
                        value={streetcodeTeaser}
                    />
                    <div className="amount-left-char-textarea-teaser">
                        <p className={leftCharForInput < 50 ? 'warning' : ''}>{leftCharForInput}</p>
                    </div>
                </Form.Item>

                <Form.Item
                    name="animations"
                    className="maincard-item"
                    label="Анімація"
                    rules={[{ required: true, message: 'Завантажте анімацію' }]}
                >
                    <Upload
                        accept=".gif"
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
                    name="pictures"
                    className="maincard-item photo-form-item"
                    label="Зображення"
                    rules={[{ required: true, message: 'Завантажте зображення' }]}
                >
                    <Upload
                        multiple
                        accept=".jpeg,.png,.jpg"
                        listType="picture-card"
                        maxCount={10}
                        onPreview={handlePreview}
                    >
                        <InboxOutlined />
                        <p className="ant-upload-text">Виберіть чи перетягніть файл</p>
                    </Upload>
                </Form.Item>

                <Form.Item
                    name="audio"
                    className="maincard-item"
                    label="Аудіо"
                >
                    <Dragger
                        accept=".mp3"
                    >
                        <InboxOutlined />

                        <p className="ant-upload-text">Виберіть чи перетягніть файл</p>
                    </Dragger>
                </Form.Item>
                <PreviewFileModal file={filePreview} opened={previewOpen} setOpened={setPreviewOpen} />
            </>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};
export default MainBlockAdmin;
