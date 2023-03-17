import './TextForm.styles.scss';

import { useState } from 'react';
import TextInputInfo from '@features/AdminPage/NewStreetcode/TextBlock/InputType/TextInputInfo.model';

import { Form, Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import LinkEditor from './Editors/LinkEditor.component';
import TextEditor from './Editors/TextEditor.component';
import TextPreview from './TextPreview/TextPreview.component';

const TextForm: React.FC = () => {
    const [inputInfo, setInputInfo] = useState<Partial<TextInputInfo>>();

    const maxTitleLength = 50;

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputInfo({ ...inputInfo, title: e.target.value });
    };

    return (
        <FormItem className="textForm">
            <Form.Item>
                <h3>Заголовок</h3>
                <Input
                    showCount
                    value={inputInfo?.title}
                    name="title"
                    type="text"
                    maxLength={maxTitleLength}
                    onChange={handleChangeTitle}
                />
            </Form.Item>
            <Form.Item>
                <TextEditor inputInfo={inputInfo} setInputInfo={setInputInfo} />
                <TextPreview inputInfo={inputInfo} />
            </Form.Item>
            <Form.Item>
                <LinkEditor inputInfo={inputInfo} setInputInfo={setInputInfo} />
            </Form.Item>
        </FormItem>
    );
};

export default TextForm;
