import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import relatedTermApi from '@api/streetcode/text-content/related-terms.api';
import useMobx, { useModalContext } from '@app/stores/root-store';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

import { AutoComplete, Button, message, Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import AddTermModal from '@/app/common/components/modals/Terms/AddTerm/AddTermModal.component';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { Term, Text } from '@/models/streetcode/text-contents.model';
import { element } from 'prop-types';

interface Props {
    character_limit?: number;
    inputInfo: Partial<Text> | undefined;
    setInputInfo: React.Dispatch<React.SetStateAction<Partial<Text> | undefined>>;
    onChange: (field: string, value: any) => void;
}

const toolTipColor = '#8D1F16';


const TextEditor = ({ character_limit, inputInfo, setInputInfo, onChange }: Props) => {

    const { relatedTermStore, termsStore } = useMobx();
    const { modalStore: { setModal } } = useModalContext();
    const { fetchTerms, getTermArray } = termsStore;
    const { createRelatedTerm } = relatedTermStore;
    const [term, setTerm] = useState<Partial<Term>>();
    const [selected, setSelected] = useState('');
    const [editor, setEditor] = useState(null);

    useEffect(() => {
        if (inputInfo?.textContent) {
            if (editor) {
                editor.setContent(inputInfo.textContent);
            }
        }
    }, [inputInfo?.textContent, editor]);

    const setOfKeys = new Set(['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight','End','Home']);

    const invokeMessage = (context: string, success: boolean) => {
        const config = {
            content: context,
            style: { marginTop: '190vh' },
        };
        if (success) {
            message.success(config);
        } else {
            message.error(config);
        }
    };

    const handleAddRelatedWord = async () => {
        if (term !== null && selected !== null) {
            const result = await createRelatedTerm(selected, term?.id as number);
            const resultMessage = result ? 'Слово було успішно прив`язано до терміну' : 'Слово вже було пов`язано';
            invokeMessage(resultMessage, result);
        }
    };

    const handleDeleteRelatedWord = async () => {
        const errorMessage = 'Слово не було пов`язано';
        try {
            if (selected == null || selected === undefined) {
                invokeMessage('Будь ласка виділіть слово для видалення', false);
                return;
            }
            await relatedTermApi.delete(selected).then(
                (response) => {
                    const resultMessage = response != null
                        ? 'Слово було успішно відв`язано від терміну' : errorMessage;
                    invokeMessage(resultMessage, response != null);
                },
            ).catch(() => invokeMessage(errorMessage, false));
        } catch {
            invokeMessage(errorMessage, false);
        }
    };

    const handleAddSimple = async () => {
        const newTerm: Term = {
            id: 0,
            title: term?.title as string,
            description: term?.description,
        };
        const result = await termsStore.createTerm(newTerm);
        const resultMessage = result != null
            ? 'Термін успішно додано' : 'Термін не було додано, спробуйте ще.';
        invokeMessage(resultMessage, result != null);
    };

    useAsync(fetchTerms, []);
    const max_length = character_limit || 15000;

    return (
        <FormItem
            label="Основний текст"
        >
            <TinyMCEEditor
                init={{
                    height: 300,
                    max_chars: 1000,
                    menubar: false,
                    init_instance_callback(editor) {
                        setEditor(editor);
                        editor.setContent(inputInfo?.textContent ?? '');
                    },
                    plugins: [
                        'autolink',
                        'lists', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                        'insertdatetime', 'wordcount', /* 'charcount', */
                    ],
                    toolbar: 'undo redo | bold italic | '
                        + 'removeformat',
                    content_style: 'body { font-family:Roboto,Helvetica Neue,sans-serif; font-size:14px }',
                }}
                onPaste={(e, editor) => {
                    const previous_content = editor.getContent({ format: 'text' });
                    const clipboard_content = e.clipboardData?.getData('text') || '';
                    const result_content = previous_content + clipboard_content;
                    const isSelectionEnd = editor.selection.getSel()?.anchorOffset == previous_content.length;

                    if (selected.length >= clipboard_content.length) {
                        return;
                    } else if (result_content.length >= max_length && isSelectionEnd) {
                        editor.setContent(previous_content + clipboard_content.substring(0, max_length - previous_content.length));
                        e.preventDefault();
                    } else if (result_content.length <= max_length && !isSelectionEnd) {
                        return;
                    } else if (result_content.length >= max_length && !isSelectionEnd) {
                        e.preventDefault();
                    }
                }}
                onKeyDown={(e, editor) => {
                    if (editor.getContent({ format: 'text' }).length >= max_length
                        && !setOfKeys.has(e.key)
                        && editor.selection.getContent({ format: 'text' }).length == 0) {
                        e.preventDefault();
                    }
                }}
                onChange={(e, editor) => {
                    setInputInfo({ ...inputInfo, textContent: editor.getContent() });
                    onChange('textContent', editor.getContent());
                }}
                onSelectionChange={(e, editor) => {
                    setSelected(editor.selection.getContent());
                }}
            />
            <Button
                className="streetcode-custom-button button-margin-vertical"
                onClick={() => setModal('addTerm')}
            >
                Додати новий термін
            </Button>
            <FormItem label="Оберіть пов'язаний термін">
                <AutoComplete
                    filterOption
                    onSelect={(value, option) => {
                        setTerm({ id: option.key, title: value });
                    }}
                    disabled={selected === ''}
                    onChange={onChange}
                >
                    {getTermArray.map(
                        (t) => <Select.Option key={t.id} value={t.title}>{t.title}</Select.Option>,
                    )}
                </AutoComplete>
            </FormItem>

            <div className="display-flex-row">
                <Button
                    className="streetcode-custom-button button-margin-vertical button-margin-right"
                    onClick={handleAddRelatedWord}
                    disabled={selected === '' || term === undefined}
                >
                    Пов&#39;язати
                </Button>
                <Button
                    onClick={handleDeleteRelatedWord}
                    disabled={selected === '' || term === undefined}
                    className="streetcode-custom-button button-margin-vertical"
                >
                    Видалити пов&#39;язаний термін
                </Button>
            </div>

            <AddTermModal handleAdd={handleAddSimple} term={term} setTerm={setTerm} />
        </FormItem>
    );
};

export default observer(TextEditor);
