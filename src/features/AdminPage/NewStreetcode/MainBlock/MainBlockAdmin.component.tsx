import './MainBlockAdmin.style.scss';

import React, { useEffect, useRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import {
    Button,
    Form, FormInstance, Input, InputNumber, InputRef, message, Popover, Select, Switch,
} from 'antd';
import ukUAlocaleDatePicker from 'antd/es/date-picker/locale/uk_UA';
import { Option } from 'antd/es/mentions';

import TagsApi from '@/app/api/additional-content/tags.api';
import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
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
const MainBlockAdmin: React.FC<Props> = ({
    form,
    selectedTags,
    setSelectedTags,
    streetcodeType,
    setStreetcodeType,
}) => {
    const teaserMaxCharCount = 520;
    const allTags = useAsync(() => TagsApi.getAll()).value;
    const [tags, setTags] = useState<Tag[]>([]);
    const [inputedChar, setInputedChar] = useState<number>(0);
    const [maxCharCount, setMaxCharCount] = useState<number>(teaserMaxCharCount);
    const [popoverProps, setPopoverProps] = useState<{
        width: number, screenWidth: number
    }>({ width: 360, screenWidth: 360 });
    const name = useRef<InputRef>(null);
    const surname = useRef<InputRef>(null);
    const [streetcodeTitle, setStreetcodeTitle] = useState<string>('');
    const firstDate = useRef<Dayjs | null>(null);
    const secondDate = useRef<Dayjs | null>(null);
    const [switchState, setSwitchState] = useState(false);

    useEffect(() => {
        form.setFieldValue('title', streetcodeTitle);

    }, [form, streetcodeTitle]);
    const onNameSurnameChange = () => {
        const curSurname = surname.current?.input?.value;
        setStreetcodeTitle(`${name.current?.input?.value}${curSurname ? ` ${curSurname}` : ''}`);
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
    const onTextAreaTeaserChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const costForNewLine = 64;
        const text = e.target.value;
        const newLinesCharCount = (text.match(/(\n|\r)/gm) || []).length;
        const newInputedChar = text.length + newLinesCharCount * costForNewLine;
        if (newInputedChar > teaserMaxCharCount || newLinesCharCount > 1) {
            return;
        }

        if (maxCharCount !== teaserMaxCharCount - newLinesCharCount * costForNewLine) {
            setMaxCharCount(teaserMaxCharCount - newLinesCharCount * costForNewLine);
        }
        setInputedChar(newInputedChar);
    };

    useEffect(() => {
        TagsApi.getAll().then(tags => setTags(tags))
    }, []);


    const onSelectTag = (selectedValue: string) => {
        let selected;
        const selectedIndex = tags.findIndex((t) => t.title === selectedValue);
        if (selectedIndex < 0) {
            let minId = selectedTags.reduce((a, b) => ((a.id < b.id) ? a : b)).id;
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
                label="Номер стріткоду"
                rules={[{ required: true, message: 'Введіть номер стріткоду' }]}
                name="streetcodeNumber"
            >
                <div className='display-flex-row'>
                    <InputNumber
                        min={0} max={10000} />
                    <Button className="button-margin-left streetcode-custom-button" onClick={onCheckIndexClick}> Перевірити</Button>
                </div>
            </Form.Item>

            <Form.Item>
                <div className='display-flex-row p-margin'>
                    <p className={switchState ? 'grey-text' : 'red-text'}>Постать</p>
                    <Switch className="person-event-switch" checked={!streetcodeType} onChange={onSwitchChange} />
                    <p className={!switchState ? 'grey-text' : 'red-text'}>Подія</p>
                </div>
            </Form.Item>

            {streetcodeType === StreetcodeType.Person ? (
                <Input.Group
                    compact
                    className="display-flex-column"
                >
                    <Form.Item name="surname" label="Прізвище" className="people-title-input">
                        <Input
                            ref={surname}
                            onChange={onNameSurnameChange}
                            maxLength={50}
                            showCount
                        />
                    </Form.Item>
                    <Form.Item label="Ім'я" name="name" className="people-title-input">
                        <Input
                            ref={name}
                            onChange={onNameSurnameChange}
                            maxLength={50}
                            showCount
                        />
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
                <Input maxLength={100} showCount />
            </Form.Item>

            <Form.Item name="alias" label="Короткий опис" className="maincard-item">
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

            <p>Теги:</p>
            <div className="tags-block">
                <div className="tags-block-tagitems">
                    <DragableTags setTags={setSelectedTags} tags={selectedTags} />

                    <Select
                        className="tags-select-input"
                        mode="tags"
                        onSelect={onSelectTag}
                        onDeselect={onDeselectTag}
                        value={selectedTags.map(x => x.title)}
                    >
                        {tags.map((t) => <Option key={`${t.id}`} value={t.title} />)}
                    </Select>
                </div>
                <div className="device-sizes-list">
                    <p>Розширення</p>
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
            <div className="teaser-form-item">
                <Form.Item
                    label="Тизер"
                    name="teaser"
                    className="maincard-item teaser-form-item"
                    rules={[{ required: true, message: 'Введіть тизер', max: 450 }]}
                >
                    <Input.TextArea
                        onChange={onTextAreaTeaserChange}
                        className="textarea-teaser"
                        maxLength={450}
                    />
                </Form.Item>
                <div className="amount-left-char-textarea-teaser">
                    <p className={teaserMaxCharCount - inputedChar < 50 ? 'warning' : ''}>
                        {inputedChar}
                        /450
                    </p>
                </div>
            </div>

            <FileInputsPart />
        </div>
    );
};
export default MainBlockAdmin;
