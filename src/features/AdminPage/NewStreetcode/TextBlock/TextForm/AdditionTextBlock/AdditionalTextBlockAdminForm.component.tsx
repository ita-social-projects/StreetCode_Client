/* eslint-disable no-restricted-imports */
/* eslint-disable react/jsx-props-no-multi-spaces */

import { observer } from 'mobx-react-lite';
import { Editor } from '@tinymce/tinymce-react';

import FormItem from 'antd/es/form/FormItem';

import { Text } from '@/models/streetcode/text-contents.model';

interface Props {
    inputInfo: Partial<Text> | undefined;
    setInputInfo: React.Dispatch<React.SetStateAction<Partial<Text> | undefined>>;
    onChange: (field: string, value: any) => void;
}

const AdditionalTextBlockAdminForm = ({ inputInfo, setInputInfo, onChange }: Props) => {
    const handleEditorChange = (content: string, editor: any) => {
        setInputInfo({ ...inputInfo, additionalText: content });
        onChange('additionalText', content);
    };

    return (
        <FormItem label="Авторство">
            <Editor
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

                onChange={(e, editor) => {
                    setInputInfo({ ...inputInfo, additionalText: editor.getContent() });
                }}
            />
        </FormItem>
    );
};

export default observer(AdditionalTextBlockAdminForm);
