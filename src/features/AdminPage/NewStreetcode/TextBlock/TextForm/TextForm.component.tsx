import './TextForm.styles.scss';

import { useState } from 'react';

import { Form, Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import LinkEditor from './Editors/LinkEditor.component';
import TextEditor from './Editors/TextEditor.component';
import TextPreview from './TextPreview/TextPreview.component';
import TextInputInfo from './TextInputInfo';

const TextForm: React.FC = () => {
    const [inputInfo, setInputInfo] = useState<Partial<TextInputInfo>>();

    const maxTitleLenght = 50;

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputInfo({ ...inputInfo, title: e.target.value });
    };

    return (
        <FormItem className="text-form">
            <Form.Item>
                <h3>Заголовок</h3>
                <Input
                    showCount
                    value={inputInfo?.title}
                    name="title"
                    type="text"
                    maxLength={maxTitleLenght}
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
