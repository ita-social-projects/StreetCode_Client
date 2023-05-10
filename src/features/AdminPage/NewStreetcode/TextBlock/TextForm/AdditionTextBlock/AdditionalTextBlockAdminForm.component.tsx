/* eslint-disable no-restricted-imports */
/* eslint-disable react/jsx-props-no-multi-spaces */

'./AdditionalTextBlockAdminForm.styles.scss';

import { observer } from 'mobx-react-lite';
// import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import { Editor } from '@tinymce/tinymce-react';

import FormItem from 'antd/es/form/FormItem';

import TextInputInfo from '../../InputType/TextInputInfo.model';

interface Props {
    inputInfo: Partial<TextInputInfo> | undefined;
    setInputInfo: React.Dispatch<React.SetStateAction<Partial<TextInputInfo> | undefined>>;
}

const AdditionalTextBlockAdminForm = ({ inputInfo, setInputInfo }:
    Props) => {
    const contentText: string = inputInfo?.аdditionalText || '';
    return (
        <FormItem label="Авторство">
            <Editor
                init={{
                    height: 300,
                    menubar: false,
                    init_instance_callback(editor) {
                        editor.setContent(contentText);
                    },
                    plugins: [
                        'autolink',
                        'lists', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                        'insertdatetime', 'wordcount', 'link', 'lists', 'formatselect ',
                    ],
                    toolbar: 'undo redo blocks bold italic link align | underline superscript subscript '
                        + 'formats blockformats align | removeformat strikethrough ',
                    content_style: 'body {font - family:Roboto,Helvetica Neue,sans-serif; font-size:14px }',
                    placeholder: 'Текст підготовлений спільно з...',
                }}

                onChange={(e, editor) => {
                    setInputInfo({ ...inputInfo, аdditionalText: editor.getContent() });
                }}
            />
        </FormItem>
    );
};

export default observer(AdditionalTextBlockAdminForm);
