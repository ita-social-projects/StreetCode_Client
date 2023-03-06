import './TextForm.styles.scss';

import { useState } from 'react';
import useMobx from '@stores/root-store';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

import { Button, Form, Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import { Term } from '@/models/streetcode/text-contents.model';

interface InputInfoTextBlock {
    text: string;
    title: string;
    link: string;
}

const TextForm: React.FC = () => {
    const [inputInfo, setInputInfo] = useState<Partial<InputInfoTextBlock>>();
    const [showPreview, setShowPreview] = useState(false);
    const { termsStore } = useMobx();
    const [term, setTerm] = useState<Partial<Term>>();

    const maxTitleLenght = 50;

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputInfo({ ...inputInfo, title: e.target.value });
    };

    // const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    //     setInputInfo({ ...inputInfo, text: e.target.value });
    //     console.log(inputInfo?.text);
    // };

    // const handleChangeText = (editor: TinyMCEEditor) => {
    //     setInputInfo({ ...inputInfo, text: editor.});
    //     console.log(inputInfo?.text);
    // };

    const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputInfo({ ...inputInfo, link: e.target.value });
    };

    const handleAddTerm = () => {
        if (term !== null && term?.title !== null) {
            const newTerm : Term = {
                id: 0,
                title: term?.title as string,
                description: term?.description,
            };
            termsStore.createTerm(newTerm);
        }
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
                <TinyMCEEditor
                    init={{
                        height: 300,
                        menubar: false,
                        plugins: [
                            'autolink', 'checklist', 'export',
                            'lists', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                            'powerpaste', 'formatpainter',
                            'insertdatetime', 'wordcount',
                        ],
                        toolbar: 'undo redo | bold italic | '
                        + 'alignleft aligncenter alignright alignjustify | '
                        + 'bullist numlist | removeformat ',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    }}
                    onChange={(e, editor) => setInputInfo({ ...inputInfo, text: editor.getContent() })}
                    onSelectionChange={(e, editor) => setTerm({ ...term, title: editor.selection.getContent() })}
                />
                <Button onClick={handleAddTerm}>Додати новий термін</Button>
            </Form.Item>
            <Form.Item name="video" rules={[{ required: true, message: 'Please enter a value' }]}>
                <div className="youtube-block">
                    <h3>Відео</h3>
                    <Input
                        title="video"
                        value={inputInfo?.link}
                        className="smaller-input"
                        placeholder="https://www.youtube.com"
                        pattern="https?://www.youtube.com/watch.+"
                        name="link"
                        required
                        onChange={handleLinkChange}
                    />
                    <Button onClick={() => setShowPreview(!showPreview)}>Попередній перегляд</Button>
                    {
                        inputInfo?.link?.includes('watch') && showPreview ? (
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
