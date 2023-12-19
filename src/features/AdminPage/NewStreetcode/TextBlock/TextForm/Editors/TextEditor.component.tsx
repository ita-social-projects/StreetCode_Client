import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import relatedTermApi from '@api/streetcode/text-content/related-terms.api';
import useMobx, { useModalContext } from '@app/stores/root-store';

import { message } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import Editor from '@/app/common/components/Editor/QEditor';
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
    const editorRef = useRef<ReactQuill | null>(null);
    const [editorContent, setEditorContent] = useState(text ?? '');

    const setOfKeys = new Set(['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'End', 'Home']);
    const MAX_CHARS = 25000;

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

    // useEffect(() => {
    //     editorRef.current = (
    //         <Editor
    //             qRef={editorRef}
    //             value={editorContent}
    //             onChange={(data) => {
    //                 setInputInfo({ ...inputInfo, textContent: data });
    //                 onChange('textContent', data);
    //             }}
    //             maxChars={MAX_CHARS}
    //         />
    //     );
    //     console.log(editorRef);
    // }, [text, inputInfo, setInputInfo, onChange]);

    return (
        <FormItem
            label="Основний текст"
        >
            <Editor
                qRef={editorRef}
                value={editorContent}
                onChange={(editor) => {
                    setEditorContent(editor);
                    setInputInfo({ ...inputInfo, textContent: editor });
                    onChange('textContent', editor);
                }}
                maxChars={MAX_CHARS}
            />
            {/* STILL NEED TO IMPLEMENT FUNCTIONALITY BELOW!!! */}
            {/* <TinyMCEEditor
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
                onSelectionChange={(e, editor) => {
                    setSelected(editor.selection.getContent());
                }}
            /> */}
        </FormItem>
    );
};

export default observer(TextEditor);
