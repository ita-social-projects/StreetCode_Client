import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import relatedTermApi from '@api/streetcode/text-content/related-terms.api';
import useMobx, { useModalContext } from '@app/stores/root-store';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

import { message } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { Term, Text } from '@/models/streetcode/text-contents.model';

interface Props {
    character_limit?: number;
    inputInfo: Partial<Text> | undefined;
    setInputInfo: React.Dispatch<React.SetStateAction<Partial<Text> | undefined>>;
    onChange: (field: string, value: any) => void;
    text: string | undefined;
}

const toolTipColor = '#8D1F16';

const TextEditor = ({
    character_limit, inputInfo, setInputInfo, onChange, text,
}: Props) => {
    const { relatedTermStore, termsStore } = useMobx();
    const { modalStore: { setModal } } = useModalContext();
    const { fetchTerms, getTermArray } = termsStore;
    const { createRelatedTerm } = relatedTermStore;
    const [term, setTerm] = useState<Partial<Term>>();
    const [selected, setSelected] = useState('');
    const editorRef = useRef<TinyMCEEditor | null>(null);
    const [editorContent, setEditorContent] = useState('');

    const setOfKeys = new Set(['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'End', 'Home']);

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
    const maxLength = character_limit || 15000;

    useEffect(() => {
        editorRef.current = (
            <TinyMCEEditor
                ref={editorRef}
                value={editorContent}
                onChange={(e, editor) => {
                    setInputInfo({ ...inputInfo, textContent: editor.getContent() });
                    onChange('textContent', editor.getContent());
                }}
                onEditorChange={(e, editor) => {
                    setEditorContent(editor.getContent());
                    setInputInfo({ ...inputInfo, textContent: editor.getContent() });
                    onChange('textContent', editor.getContent());
                }}
                init={{
                    max_chars: 1000,
                    height: 300,
                    menubar: false,
                    init_instance_callback(editor) {
                        setEditorContent(text ?? '');
                        editor.setContent(text ?? '');
                    },
                    plugins: [
                        'autolink',
                        'lists', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                        'insertdatetime', 'wordcount', 'link', 'lists', 'formatselect ',
                    ],
                    toolbar: 'undo redo | bold italic | '
                    + 'removeformat',
                    toolbar_mode: 'sliding',
                    language: 'uk',
                    entity_encoding: 'raw',
                    content_style: 'body { font-family:Roboto,Helvetica Neue,sans-serif; font-size:14px }',
                }}
                onPaste={(e, editor) => {
                    const previousContent = editor.getContent({ format: 'text' });
                    const clipboardContent = e.clipboardData?.getData('text') || '';
                    const resultContent = previousContent + clipboardContent;
                    const isSelectionEnd = editor.selection.getSel()?.anchorOffset == previousContent.length;

                    if (selected.length >= clipboardContent.length) {
                        return;
                    }
                    if (resultContent.length >= maxLength && isSelectionEnd) {
                    // eslint-disable-next-line max-len
                        editor.setContent(previousContent + clipboardContent.substring(0, maxLength - previousContent.length));
                        e.preventDefault();
                    }
                    if (resultContent.length <= maxLength && !isSelectionEnd) {
                        return;
                    }
                    if (resultContent.length >= maxLength && !isSelectionEnd) {
                        e.preventDefault();
                    }
                }}
                onKeyDown={(e, editor) => {
                    if (editor.getContent({ format: 'text' }).length >= maxLength
                    && !setOfKeys.has(e.key)
                    && editor.selection.getContent({ format: 'text' }).length === 0) {
                        e.preventDefault();
                    }
                }}
                onSelectionChange={(e, editor) => {
                    setSelected(editor.selection.getContent());
                }}
            />
        );
        console.log(editorRef);
    }, [text, inputInfo, setInputInfo, onChange]);

    return (
        <FormItem
            label="Основний текст"
        >
            <TinyMCEEditor
                ref={editorRef}
                value={editorContent}
                onChange={(e, editor) => {
                    setInputInfo({ ...inputInfo, textContent: editor.getContent() });
                    onChange('textContent', editor.getContent());
                }}
                onEditorChange={(e, editor) => {
                    setEditorContent(editor.getContent());
                    setInputInfo({ ...inputInfo, textContent: editor.getContent() });
                    onChange('textContent', editor.getContent());
                }}
                init={{
                    max_chars: 1000,
                    height: 300,
                    menubar: false,
                    init_instance_callback(editor) {
                        setEditorContent(text ?? '');
                        editor.setContent(text ?? '');
                    },
                    plugins: [
                        'autolink',
                        'lists', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                        'insertdatetime', 'wordcount', 'link', 'lists', 'formatselect ',
                    ],
                    toolbar: 'undo redo | bold italic | '
                        + 'removeformat',
                    toolbar_mode: 'sliding',
                    language: 'uk',
                    entity_encoding: 'raw',
                    content_style: 'body { font-family:Roboto,Helvetica Neue,sans-serif; font-size:14px }',
                }}
                onPaste={(e, editor) => {
                    const previousContent = editor.getContent({ format: 'text' });
                    const clipboardContent = e.clipboardData?.getData('text') || '';
                    const resultContent = previousContent + clipboardContent;
                    const isSelectionEnd = editor.selection.getSel()?.anchorOffset == previousContent.length;

                    if (selected.length >= clipboardContent.length) {
                        return;
                    }
                    if (resultContent.length >= maxLength && isSelectionEnd) {
                        // eslint-disable-next-line max-len
                        editor.setContent(previousContent + clipboardContent.substring(0, maxLength - previousContent.length));
                        e.preventDefault();
                    }
                    if (resultContent.length <= maxLength && !isSelectionEnd) {
                        return;
                    }
                    if (resultContent.length >= maxLength && !isSelectionEnd) {
                        e.preventDefault();
                    }
                }}
                onKeyDown={(e, editor) => {
                    if (editor.getContent({ format: 'text' }).length >= maxLength
                        && !setOfKeys.has(e.key)
                        && editor.selection.getContent({ format: 'text' }).length === 0) {
                        e.preventDefault();
                    }
                }}
                onSelectionChange={(e, editor) => {
                    setSelected(editor.selection.getContent());
                }}
            />
        </FormItem>
    );
};

export default observer(TextEditor);
