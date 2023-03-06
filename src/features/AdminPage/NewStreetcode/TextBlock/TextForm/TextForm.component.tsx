import './TextForm.styles.scss';

import { useState } from 'react';
import useMobx from '@stores/root-store';

import { Button, Form, Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';

import { Term } from '@/models/streetcode/text-contents.model';

interface InputInfoTextBlock {
    text: string;
    title: string;
    link: string;
}

const TextForm: React.FC = () => {
    const [inputInfo, setInputInfo] = useState<Partial<InputInfoTextBlock>>();
    const { termsStore } = useMobx();
    const [term, setTerm] = useState<Partial<Term>>();

    const maxTitleLenght = 50;

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputInfo({ ...inputInfo, title: e.target.value });
    };

    const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputInfo({ ...inputInfo, text: e.target.value });
    };

    const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputInfo({ ...inputInfo, link: e.target.value });
        setTerm({ ...term, title: `${window.getSelection()?.toString()}` });
    };

    const handleSelected = () => {
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
                <h3>Основний текст</h3>
                <TextArea
                    value={inputInfo?.text}
                    showCount
                    name="main-text"
                    id="main-text-selection-area"
                    defaultValue="Example Text"
                    required
                    onChange={handleChangeText}
                />
                <Button onClick={handleSelected}>Додати новий термін</Button>
            </Form.Item>
            <Form.Item>
                <div className="youtube-block">
                    <h3>Відео</h3>
                    <Input
                        value={inputInfo?.link}
                        className="smaller-input"
                        placeholder="https://www.youtube.com"
                        pattern="https?://www.youtube.com/watch.+"
                        name="link"
                        required
                        onChange={handleLinkChange}
                    />
                    {
                        inputInfo?.link?.includes('watch') ? (
                            <div>
                                <h4>Попередній перегляд</h4>
                                <iframe
                                    title="video-preview"
                                    src={
                                        inputInfo?.link?.includes('/watch?v=')
                                            ? inputInfo?.link?.replace('/watch?v=', '/embed/')
                                            : inputInfo?.link
                                    }
                                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                                />
                            </div>
                        ) : (
                            <div />
                        )
                    }
                </div>
            </Form.Item>
        </FormItem>
    );
};

export default TextForm;
