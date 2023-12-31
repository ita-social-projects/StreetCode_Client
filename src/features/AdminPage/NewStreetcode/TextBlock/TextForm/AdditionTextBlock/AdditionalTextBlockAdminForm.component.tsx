/* eslint-disable no-restricted-imports */
/* eslint-disable react/jsx-props-no-multi-spaces */

import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import ReactQuill from 'react-quill';

import FormItem from 'antd/es/form/FormItem';

import Editor from '@/app/common/components/Editor/QEditor';
import { Text } from '@/models/streetcode/text-contents.model';

interface Props {
    character_limit?: number;
    inputInfo: Partial<Text> | undefined;
    setInputInfo: React.Dispatch<React.SetStateAction<Partial<Text> | undefined>>;
    onChange: (field: string, value: any) => void;
    text : string | undefined;
}

const AdditionalTextBlockAdminForm = ({
    character_limit, inputInfo, setInputInfo, onChange, text,
}: Props) => {
    const maxLength = character_limit || 200;
    const editorRef = useRef<ReactQuill | null>(null);

    return (
        <FormItem label="Авторство">
            <Editor
                qRef={editorRef}
                value={(text === undefined || text === '') ? 'Текст підготовлений спільно з' : text}
                onChange={(editor) => {
                    setInputInfo({ ...inputInfo, additionalText: editor });
                    onChange('additionalText', editor);
                }}
                maxChars={maxLength}
            />
        </FormItem>
    );
};

export default observer(AdditionalTextBlockAdminForm);
