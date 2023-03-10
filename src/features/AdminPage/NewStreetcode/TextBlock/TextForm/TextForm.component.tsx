import './TextForm.styles.scss';

import { useState } from 'react';
import useMobx from '@stores/root-store';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

import {
    AutoComplete, Button, Form, Input, Select, Tooltip,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
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
    const { fetchTerms, getTermArray } = termsStore;
    const [term, setTerm] = useState<Partial<Term>>();
    const [selected, setSelected] = useState('');

    useAsync(fetchTerms, []);

    const maxTitleLenght = 50;

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputInfo({ ...inputInfo, title: e.target.value });
    };
    const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputInfo({ ...inputInfo, link: e.target.value });
    };

    const handleAddRelatedWord = () => {
        console.log(term?.id);
        console.log(term?.title);
        console.log(selected);
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
                    onChange={(e, editor) => {
                        setInputInfo({ ...inputInfo, text: editor.getContent() });
                    }}
                    onSelectionChange={(e, editor) => {
                        setSelected(editor.selection.getContent());
                    }}
                />
                <Form.Item label="Оберіть пов'язаний термін">
                    <Tooltip
                        title={selected !== '' ? '' : 'Спочатку виділіть слово у тексті'}
                        color="#8D1F16"
                    >
                        <AutoComplete
                            filterOption
                            onSelect={(value, option) => {
                                setTerm({ id: option.key, title: value });
                            }}
                            disabled={selected === ''}
                        >
                            {getTermArray.map(
                                (t) => <Select.Option key={t.id} value={t.title}>{t.title}</Select.Option>,
                            )}
                        </AutoComplete>
                    </Tooltip>
                </Form.Item>
                <Tooltip
                    title={
                        selected !== '' && term !== undefined
                            ? `${selected} з ${term?.title}` : 'Виділіть слово та термін!'
                    }
                    color="#8D1F16"
                >
                    <Button
                        onClick={handleAddRelatedWord}
                        disabled={selected === '' || term === undefined}
                    >
                        Пов&#39;язати
                    </Button>
                </Tooltip>
            </Form.Item>
            <Form.Item name="video" rules={[{ required: true, message: 'Будь ласка, введіть посилання!' }]}>
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
                    <Tooltip
                        title={
                            inputInfo?.link?.includes('watch')
                                ? '' : 'Вкажіть посилання на youtube.com/watch!'
                        }
                        color="#8D1F16"
                    >
                        <Button
                            disabled={!inputInfo?.link?.includes('watch')}
                            onClick={() => setShowPreview(!showPreview)}
                        >
                            Попередній перегляд
                        </Button>
                    </Tooltip>
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
