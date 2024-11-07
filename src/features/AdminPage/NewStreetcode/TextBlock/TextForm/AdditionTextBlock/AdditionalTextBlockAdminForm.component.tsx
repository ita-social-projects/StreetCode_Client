/* eslint-disable no-restricted-imports */
/* eslint-disable react/jsx-props-no-multi-spaces */

import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';

import FormItem from 'antd/es/form/FormItem';

import Editor from '@/app/common/components/Editor/QEditor.component';
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
    const [isTextContentEmpty, setIsTextContentEmpty] = useState(true);
    const [isTitleEmpty, setIsTitleEmpty] = useState(true);

    useEffect(() => {
        setIsTextContentEmpty(!inputInfo?.textContent || inputInfo.textContent === "<p><br></p>");
      }, [inputInfo?.textContent]);

    useEffect(() => {
        setIsTitleEmpty(!inputInfo?.title || inputInfo.title === "");
      }, [inputInfo?.title]);


    const handleEditorChange = (editor: string) => {
        setInputInfo((prev) => ({ ...prev, additionalText: editor }));
        onChange('additionalText', editor);
    };
    
    return (
        <FormItem
            name="additionalText"
            label="Авторство"
        >
            <div className={isTextContentEmpty || isTitleEmpty ? "disabled" : ""}>
            <Editor
                qRef={editorRef}
                value={(text === undefined || text === '') ? 'Текст підготовлений спільно з' : text}
                onChange={handleEditorChange}
                maxChars={maxLength}
                readOnly={isTitleEmpty || isTextContentEmpty}
            />
            </div>
        </FormItem>
    );
};

export default observer(AdditionalTextBlockAdminForm);
