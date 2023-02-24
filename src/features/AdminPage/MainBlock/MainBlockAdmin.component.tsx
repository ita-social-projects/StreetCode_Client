import './MainBlockAdmin.style.scss';

import React, { useState } from 'react';

import {
    Button, Form, Input, InputNumber, Select,
} from 'antd';

import Tag, { TagVisible } from '@/models/additional-content/tag.model';

import DragableTags from './DragableTags/DragableTags.component';

const MainBlockAdmin: React.FC<{ streetcodeType: 'people' | 'event' }> = ({ streetcodeType }) => {
    const [tags, setTags] = useState< Tag[]>([
        { id: 1, title: 'first' },
        { id: 2, title: 'second' },
        { id: 3, title: 'third' },
    ]);

    const [selectedTags, setSelectedTags] = useState<TagVisible[]>([]);

    const onSelectTag = (value: string) => {
        let selected;
        const selectedIndex = tags.findIndex((t) => t.title === value);
        if (selectedIndex < 0) {
            const newId = Math.max(...selectedTags.map((t) => t.id));
            selected = { id: newId, title: value };
            setTags([...tags, selected]);
        } else {
            selected = tags[selectedIndex];
        }

        setSelectedTags([...selectedTags, { ...selected, visible: true }]);
    };
    const onDeselectTag = (value:string) => {
        setSelectedTags(selectedTags.filter((t) => t.title !== value));
    };
    return (
        <Form layout="vertical" className="mainblock-add-form">
            <>
                <Form.Item label="Номер стріткоду" style={{ fontSize: '20px' }} className="mainblock-add-form-item">
                    <InputNumber min={0} />
                </Form.Item>
                {streetcodeType === 'people' ? (
                    <Input.Group compact style={{ fontSize: '20px' }}>
                        <Form.Item label="Прізвище">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Ім'я">
                            <Input />
                        </Form.Item>
                        <Form.Item label="По батькові">
                            <Input />
                        </Form.Item>
                    </Input.Group>
                )
                    : (
                        <Form.Item label="Назва події">
                            <Input />
                        </Form.Item>
                    )}

                <DragableTags setTags={setSelectedTags} tags={selectedTags} />
                <Select style={{ width: '100%' }} mode="tags" onSelect={onSelectTag} onDeselect={onDeselectTag}>
                    {tags.map((t) => <Select.Option key={t.id} value={t.title} label={t.title} />)}
                </Select>
            </>
        </Form>
    );
};
export default MainBlockAdmin;
