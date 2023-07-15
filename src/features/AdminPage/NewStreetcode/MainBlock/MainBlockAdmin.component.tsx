import './MainBlockAdmin.style.scss';

import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InfoCircleOutlined } from '@ant-design/icons';
import getNewMinNegativeId from '@app/common/utils/newIdForStore';
import useMobx from '@app/stores/root-store';
import { ModelState } from '@models/enums/model-state';
import dayjs, { Dayjs } from 'dayjs';

import {
    Button,
    Form, FormInstance, Input, InputNumber, InputRef, message, Popover, Select, Space, Switch,
} from 'antd';
import ukUAlocaleDatePicker from 'antd/es/date-picker/locale/uk_UA';
import { Option } from 'antd/es/mentions';

import TagsApi from '@/app/api/additional-content/tags.api';
import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import Tag, { StreetcodeTag, StreetcodeTagUpdate } from '@/models/additional-content/tag.model';
import { StreetcodeType } from '@/models/streetcode/streetcode-types.model';

import DragableTags from './DragableTags/DragableTags.component';
import PopoverForTagContent from './PopoverForTagContent/PopoverForTagContent.component';
import DatePickerPart from './DatePickerPart.component';
import FileInputsPart from './FileInputsPart.component';

interface TagPreviewProps {
    width: number;
    screenWidth: number;
}

interface Props {
    form: FormInstance<any>,
    selectedTags: StreetcodeTag[];
    setSelectedTags: React.Dispatch<React.SetStateAction<StreetcodeTag[]>>;
    streetcodeType: MutableRefObject<StreetcodeType>;
    onChange: (fieldName: string, value: any) => void;
}

const MainBlockAdmin = React.memo(({
    form, selectedTags, setSelectedTags, streetcodeType, setStreetcodeType, onChange,
}: Props) => {
    const teaserMaxCharCount = 520;
    const tagPreviewPropsList: TagPreviewProps[] = [
        { width: 360, screenWidth: 360 },
        { width: 365, screenWidth: 768 },
        { width: 612, screenWidth: 1600 },
    ];
    const { tagsStore } = useMobx();
    const [tags, setTags] = useState<Tag[]>([]);
    const [popoverProps, setPopoverProps] = useState<TagPreviewProps>(tagPreviewPropsList[0]);
    const name = useRef<InputRef>(null);
    const surname = useRef<InputRef>(null);
    const firstDate = useRef<Dayjs | null>(null);
    const secondDate = useRef<Dayjs | null>(null);
    const [switchState, setSwitchState] = useState(false);

    const handleInputChange = (fieldName: string, value: any) => {
        onChange(fieldName, value);
    };

    const onCheckIndexClick = () => {
        const number = form.getFieldValue('streetcodeNumber') as number;
        if (number) {
            StreetcodesApi.existWithIndex(number)
                .then((exist) => {
                    if (exist) {
                        message.error('Даний номер уже використовується стріткодом. Використайте інший, будь ласка.');
                    } else {
                        message.success(
                            'Ще жоден стріткод не має такого номеру. Можете з впевненістю його використовувати.',
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
            streetcodeType.current = StreetcodeType.Event;
        } else {
            streetcodeType.current = StreetcodeType.Person;
        }
        setSwitchState(!switchState);
    };

    useEffect(() => {
        TagsApi.getAll().then((tgs) => setTags(tgs));
    }, []);

    const onSelectTag = (selectedValue: string) => {
        const deletedTag = tagsStore.getTagToDeleteArray.find((tag) => tag.title === selectedValue);
        if (deletedTag) { // for case when delete persisted item and add it again
            tagsStore.deleteItemFromArrayToDelete(selectedValue);
            setSelectedTags([...selectedTags, deletedTag]);
        } else {
            const selectedIndex = tags.findIndex((t) => t.title === selectedValue);

            const newItem: StreetcodeTagUpdate = {
                id: selectedIndex < 0 ? getNewMinNegativeId(selectedTags.map((tag) => tag.id)) : tags[selectedIndex].id,
                title: selectedValue,
                isVisible: false,
                modelState: ModelState.Created,
            };

            setSelectedTags([...selectedTags, newItem]);
        }
    };

    const onDeselectTag = (deselectedValue: string) => {
        const tag = selectedTags.find((t) => t.title === deselectedValue) as StreetcodeTagUpdate;
        if (tag?.isPersisted) {
            tag.modelState = ModelState.Deleted;
            tagsStore.setItemToDelete(tag);
        }
        setSelectedTags(selectedTags.filter((t) => t.title !== deselectedValue));
    };

    dayjs.locale('uk');
    const dayJsUa = require("dayjs/locale/uk"); // eslint-disable-line
    ukUAlocaleDatePicker.lang.shortWeekDays = dayJsUa.weekdaysShort;
    ukUAlocaleDatePicker.lang.shortMonths = dayJsUa.monthsShort;

    return (
        <div className="mainblock-add-form">
            <div className="display-flex-row">
                <Form.Item
                    label="Номер стріткоду"
                    rules={[{ required: true, message: 'Введіть номер стріткоду від 1 до 10000, будь ласка' },
                        { max: 10000,
                          min: 0,
                          pattern: /^\d+$/,
                          type: 'number',
                          message: 'Номер стріткоду може бути тільки від 1 до 10000' },
                    ]}
                    name="streetcodeNumber"
                >
                    <InputNumber defaultValue={1} />
                </Form.Item>

                <Button
                    className="button-margin-left checknumber streetcode-custom-button"
                    onClick={onCheckIndexClick}
                >
                    Перевірити
                </Button>
            </div>
            <div className="display-flex-row p-margin">
                <p className={switchState ? 'grey-text' : 'red-text'}>Постать</p>
                <Form.Item name="streetcodeType">
                    <Switch
                        className="person-event-switch"
                        checked={streetcodeType.current === StreetcodeType.Event}
                        onChange={onSwitchChange}
                    />

                </Form.Item>
                <p className={!switchState ? 'grey-text' : 'red-text'}>Подія</p>
            </div>

            <Form.Item
                name="title"
                label="Назва стріткоду"
                className="maincard-item"
                rules={[{ required: true, message: 'Введіть назву стріткоду, будь ласка' },
                    { max: 100, message: 'Назва стріткоду не може містити більше 100 символів' }]}
            >
                <Input
                    maxLength={100}
                    showCount
                    onChange={(e) => handleInputChange(Form.Item.name, e.target.value)}
                />
            </Form.Item>

            {streetcodeType === StreetcodeType.Person ? (
                <Space.Compact
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
                            onChange={(e) => handleInputChange(Form.Item.name, e.target.value)}
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
                            onChange={(e) => handleInputChange(Form.Item.name, e.target.value)}
                        />
                    </Form.Item>
                </Space.Compact>
            )
                : ('')}
            <Form.Item name="alias" label="Короткий опис (для зв'язків історії)" className="maincard-item">
                <Input
                    maxLength={33}
                    showCount
                    onChange={(e) => handleInputChange(Form.Item.name, e.target.value)}
                />
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
                    onChange={(e) => handleInputChange(Form.Item.name, e.target.value)}
                />
            </Form.Item>

            <DatePickerPart
                form={form}
                onChange={handleInputChange}
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
                            content={(
                                <p className="label-tags-block-info-container-content">
                                    При обиранні теги є невидимими для користувача (фон тегу сірий),
                                    тобто він не відображається
                                    на головній картці стріткоду.
                                    Якщо натиснути на тег, його стан зміниться на видимий (фон - білий).
                                    Нижче є розширення наводячи на які, можна побачити, які теги
                                    будуть вміщатись на головній картці стріткоду.
                                    {' '}
                                </p>
                            )}
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
                            onSelect={(selectedValue, option) => {
                                handleInputChange(option.key, selectedValue);
                                onSelectTag(selectedValue);
                            }}
                            onDeselect={(deselectedValue, option) => {
                                handleInputChange(option.key, deselectedValue);
                                onDeselectTag(deselectedValue);
                            }}
                            value={selectedTags.map((x) => x.title)}
                        >
                            {tags.map((t) => <Select.Option key={`${t.id}`} value={t.title}>{t.title}</Select.Option>)}
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
                                    key={el.screenWidth}
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
                        onChange={(e) => handleInputChange(Form.Item.name, e.target.value)}
                    />
                </Form.Item>
            </div>
            <FileInputsPart onChange={handleInputChange} />
        </div>
    );
});
export default MainBlockAdmin;
