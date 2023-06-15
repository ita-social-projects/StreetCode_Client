import './MainBlockAdmin.style.scss';

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InfoCircleOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

import {
    Button,
    Form, FormInstance, Input, InputNumber, InputRef, message, Popover, Select, Switch,
} from 'antd';
import ukUAlocaleDatePicker from 'antd/es/date-picker/locale/uk_UA';
import { Option } from 'antd/es/mentions';

import TagsApi from '@/app/api/additional-content/tags.api';
import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import Tag, { StreetcodeTag } from '@/models/additional-content/tag.model';
import { StreetcodeType } from '@/models/streetcode/streetcode-types.model';

import DragableTags from './DragableTags/DragableTags.component';
import PopoverForTagContent from './PopoverForTagContent/PopoverForTagContent.component';
import DatePickerPart from './DatePickerPart.component';
import FileInputsPart from './FileInputsPart.component';

interface Props {
    form: FormInstance<any>,
    selectedTags: StreetcodeTag[];
    setSelectedTags: React.Dispatch<React.SetStateAction<StreetcodeTag[]>>;
    streetcodeType: StreetcodeType;
    setStreetcodeType: React.Dispatch<React.SetStateAction<StreetcodeType>>;
}

interface TagPreviewProps {
    width: number;
    screenWidth: number;
}
const MainBlockAdmin: React.FC<Props> = ({
    form,
    selectedTags,
    setSelectedTags,
    streetcodeType,
    setStreetcodeType,
}) => {
    const teaserMaxCharCount = 520;
    const tagPreviewPropsList:TagPreviewProps[] = [
        { width: 360, screenWidth: 360 },
        { width: 365, screenWidth: 768 },
        { width: 612, screenWidth: 1600 },
    ];
    const [tags, setTags] = useState<Tag[]>([]);
    const [popoverProps, setPopoverProps] = useState<TagPreviewProps>(tagPreviewPropsList[0]);
    const name = useRef<InputRef>(null);
    const surname = useRef<InputRef>(null);
    const [streetcodeTitle, setStreetcodeTitle] = useState<string>('');
    const firstDate = useRef<Dayjs | null>(null);
    const secondDate = useRef<Dayjs | null>(null);
    const [switchState, setSwitchState] = useState(false);
    const [indexId, setIndexId] = useState<number>(1);
    const { id } = useParams<any>();
    const parseId = id ? +id : null;

    useEffect(() => {
        form.setFieldValue('title', streetcodeTitle);
        if (parseId) {
            StreetcodesApi.getById(parseId).then((x) => setIndexId(x.index));
        }
    }, [form, streetcodeTitle]);

    const onCheckIndexClick = () => {
        const number = form.getFieldValue('streetcodeNumber') as number;
        if (number) {
            StreetcodesApi.existWithIndex(number)
                .then((exist) => {
                    if (exist) {
                        message.error('Даний номер уже використовується стріткодом. Використайте інший, будь ласка.');
                    } else {
                        message.success(
                            'Ще жодний стріткоду не має такого номеру. Можете з впевненістю його використовувати',
                        );
                    }
                })
                .catch(() => {
                    message.error('Сервер не відповідає');
                });
        } else {
            message.error('Поле порожнє');
        }
    };
    const onSwitchChange = (value: boolean) => {
        if (value) {
            setStreetcodeType(StreetcodeType.Event);
        } else {
            setStreetcodeType(StreetcodeType.Person);
        }
        setSwitchState(!switchState);
    };

    useEffect(() => {
        TagsApi.getAll().then((tgs) => setTags(tgs));
    }, []);

    const setIndex = (index :number | null) => {
        if (index) {
            form.setFieldValue('streetcodeNumber', index);
            setIndexId(index);
        }
    };
    const onSelectTag = (selectedValue: string) => {
        let selected;
        const selectedIndex = tags.findIndex((t) => t.title === selectedValue);
        if (selectedIndex < 0) {
            let minId = Math.min(...selectedTags.map((t) => t.id));
            if (minId < 0) {
                minId -= 1;
            } else {
                minId = -1;
            }
            setSelectedTags([...selectedTags, { id: minId, title: selectedValue, isVisible: false }]);
        } else {
            selected = tags[selectedIndex];

            setSelectedTags([...selectedTags, { ...selected, title: selectedValue, isVisible: false }]);
        }
    };

    const onDeselectTag = (deselectedValue: string) => {
        setSelectedTags(selectedTags.filter((t) => t.title !== deselectedValue));
    };

    dayjs.locale('uk');
    const dayJsUa = require("dayjs/locale/uk"); // eslint-disable-line
    ukUAlocaleDatePicker.lang.shortWeekDays = dayJsUa.weekdaysShort;
    ukUAlocaleDatePicker.lang.shortMonths = dayJsUa.monthsShort;

    return (
        <div className="mainblock-add-form">
            <Form.Item
                initialValue={1}
                label="Номер стріткоду"
                rules={[{ required: true, message: 'Введіть номер стріткоду, будь ласка' },
                    { pattern: /^\d+$/, message: 'Введіть цифру, будь ласка' }]}
                name="streetcodeNumber"
            >
                <div className="display-flex-row">
                    <InputNumber
                        min={0}
                        max={10000}
                        value={indexId}
                        onChange={setIndex}
                    />
                    <Button
                        className="button-margin-left streetcode-custom-button"
                        onClick={onCheckIndexClick}
                    >
                        {' '}
                        Перевірити
                    </Button>
                </div>
            </Form.Item>

            <Form.Item>
                <div className="display-flex-row p-margin">
                    <p className={switchState ? 'grey-text' : 'red-text'}>Постать</p>
                    <Switch className="person-event-switch" checked={!streetcodeType} onChange={onSwitchChange} />
                    <p className={!switchState ? 'grey-text' : 'red-text'}>Подія</p>
                </div>
            </Form.Item>

            <Form.Item
                name="title"
                label="Назва стріткоду"
                className="maincard-item"
                rules={[{ required: true, message: 'Введіть назву стріткоду, будь ласка' },
                    { max: 100, message: 'Назва стріткоду не може містити більше 100 символів' }]}
            >
                <Input maxLength={100} showCount />
            </Form.Item>

            {streetcodeType === StreetcodeType.Person ? (
                <Input.Group
                    compact
                    className="display-flex-column"
                >
                    <Form.Item
                        label="Ім'я"
                        name="name"
                        className="people-title-input"
                        rules={[{ max: 50, message: "Ім'я не може містити більше 50 символів" }]}
                    >
                        <Input
                            ref={name}
                            maxLength={50}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item
                        name="surname"
                        label="Прізвище"
                        className="people-title-input"
                        rules={[
                            { max: 50, message: 'Прізвище не може містити більше 50 символів ' },
                        ]}
                    >
                        <Input
                            ref={surname}
                            maxLength={50}
                            showCount
                        />
                    </Form.Item>
                </Input.Group>
            )
                : ('')}

            <Form.Item name="alias" label="Короткий опис (для зв'язків історії)" className="maincard-item">
                <Input maxLength={33} showCount />
            </Form.Item>
            <Form.Item
                label="URL"
                name="streetcodeUrlName"
                className="maincard-item"
                rules={[{ required: true, message: 'Введіть літерал для стріткоду', max: 100, pattern: /^[a-z-]+$/ }]}
            >
                <Input
                    maxLength={100}
                    showCount
                />
            </Form.Item>

            <DatePickerPart
                form={form}
                setFirstDate={(newDate: Dayjs | null) => {
                    firstDate.current = newDate;
                }}
                setSecondDate={(newDate: Dayjs | null) => {
                    secondDate.current = newDate;
                }}
            />

            <div className="tags-block">
                <Form.Item label={(
                    <div className="label-tags-block">
                        <p>Теги</p>
                        <Popover
                            className="info-container"
                            placement="topLeft"
                            content={'При обиранні теги є невидимими для користувача (фон тегу сірий), тобто він не відображається на головній картці стріткоду. '
                            + 'Якщо натиснути на тег, його стан зміниться на видимий (фон - білий). Нижче є розширення наводячи на які, можна побачити, які теги будуть вміщатись на головній картці стріткоду. '}
                        >
                            <InfoCircleOutlined className="info-icon" />
                        </Popover>
                    </div>
                )}
                >
                    <div className="tags-block-tagitems">
                        <DragableTags setTags={setSelectedTags} tags={selectedTags} />

                        <Select
                            className="tags-select-input"
                            mode="tags"
                            onSelect={onSelectTag}
                            onDeselect={onDeselectTag}
                            value={selectedTags.map((x) => x.title)}
                        >
                            {tags.map((t) => <Option key={`${t.id}`} value={t.title} />)}
                        </Select>
                    </div>
                </Form.Item>
                <div className="device-sizes-list">
                    <Form.Item label="Розширення">
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
                            {tagPreviewPropsList.map((el) => (
                                <p
                                    className="device-size"
                                    onMouseEnter={() => setPopoverProps(el)}
                                >
                                    {el.screenWidth}
                                </p>
                            ))}
                        </Popover>
                    </Form.Item>
                </div>
            </div>
            <div className="teaser-form-item">
                <Form.Item
                    label="Тизер"
                    name="teaser"
                    className="maincard-item teaser-form-item"
                    rules={[{ required: true, message: 'Введіть тизер', max: teaserMaxCharCount }]}
                >
                    <Input.TextArea
                        showCount
                        className="textarea-teaser"
                        maxLength={teaserMaxCharCount}
                    />
                </Form.Item>
            </div>

            <FileInputsPart />
        </div>
    );
};
export default MainBlockAdmin;
