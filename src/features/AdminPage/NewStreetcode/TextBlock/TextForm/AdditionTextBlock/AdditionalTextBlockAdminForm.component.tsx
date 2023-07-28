/* eslint-disable no-restricted-imports */
/* eslint-disable react/jsx-props-no-multi-spaces */

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

import FormItem from 'antd/es/form/FormItem';

import { Text } from '@/models/streetcode/text-contents.model';

interface Props {
    character_limit?: number;
    inputInfo: Partial<Text> | undefined;
    setInputInfo: React.Dispatch<React.SetStateAction<Partial<Text> | undefined>>;
    onChange: (field: string, value: any) => void;
}

const AdditionalTextBlockAdminForm = ({ character_limit, inputInfo, setInputInfo, onChange }: Props) => {
    const handleEditorChange = (content: string, editor: any) => {
        setInputInfo({ ...inputInfo, additionalText: content });
        onChange('additionalText', content);
    };
    const [selected, setSelected] = useState('');
    const setOfKeys = new Set(['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight','End','Home']);
    const maxLength = character_limit || 200;

    return (
        <FormItem label="Авторство">
            <TinyMCEEditor
                onEditorChange={handleEditorChange}
                init={{
                    language: 'uk',
                    height: 300,

                    menubar: false,
                    init_instance_callback(editor) {
                        editor.setContent(inputInfo?.additionalText ?? 'Текст підготовлений спільно з');
                    },
                    plugins: [
                        'autolink',
                        'lists', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                        'insertdatetime', 'wordcount', 'link', 'lists', /* 'formatselect', */
                    ],
                    toolbar: 'undo redo blocks bold italic link align | underline superscript subscript '
                        + 'formats blockformats align | removeformat strikethrough ',
                    content_style: 'body {font - family:Roboto,Helvetica Neue,sans-serif; font-size:14px }',
                    link_title: false,
                    link_target_list: false,
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
                        && editor.selection.getContent({ format: 'text' }).length == 0) {
                        e.preventDefault();
                    }
                }}
                onChange={(e, editor) => {
                    setInputInfo({ ...inputInfo, additionalText: editor.getContent() });
                }}
                onSelectionChange={(e, editor) => {
                    setSelected(editor.selection.getContent());
                }}
            />
        </FormItem>
    );
};

export default observer(AdditionalTextBlockAdminForm);
