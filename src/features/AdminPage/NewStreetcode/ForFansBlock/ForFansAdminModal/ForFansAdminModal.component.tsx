'./ForFansAdminModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import useMobx from '@stores/root-store';
import { Editor } from '@tinymce/tinymce-react';

import { Button, Form, Modal, Select, Upload } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import SourcesApi from '@/app/api/sources/sources.api';
import { SourceCategory, SourceCategoryName, StreetcodeCategoryContent } from '@/models/sources/sources.model';

interface Props {
    sourceCategory? : StreetcodeCategoryContent
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    allCategories: SourceCategoryName[],
    streetcodeCategoryContents: StreetcodeCategoryContent[],
    setStreetcodeCategoryContents: React.Dispatch<React.SetStateAction<StreetcodeCategoryContent[]>>,
}

const ForFansModal = ({
    sourceCategory, open, setOpen, allCategories, streetcodeCategoryContents, setStreetcodeCategoryContents,
} : Props) => {
    const editorRef = useRef<Editor | null>(null);
    const selectedCategory = useRef<string | null>(null);


    const onSave = () => {
        if (sourceCategory) {
            sourceCategory.text = editorRef.current?.editor?.getContent();
        } else {
            setStreetcodeCategoryContents([...streetcodeCategoryContents,
                { id: streetcodeCategoryContents.length, text: editorRef.current?.editor?.getContent() }]);
        }
        setOpen(false);
    };

    return (
        <Modal
            className="forFansAdminModal"
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
            maskClosable
            centered
            closeIcon={<CancelBtn />}
        >
            <h2>Для фанатів</h2>
            <Select
                className="tags-select-input"
                onSelect={(value:string) => {
                    selectedCategory.current = value;
                }}
            >
                {allCategories.map((c) => <Option key={`${t.id}`} value={c.title} />)}
            </Select>
            <Editor
                ref={editorRef}
                init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                        'autolink',
                        'lists', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                        'insertdatetime', 'wordcount', 'link', 'lists', 'formatselect ',
                    ],
                    toolbar: 'checklist | bold  formatselect  italic underline strikethrough superscript subscript codeformat '
                     + 'formats blockformats align | removeformat link',
                    content_style: 'body { font-family:Roboto,Helvetica Neue,sans-serif; font-size:14px }',
                }}
            />
            <Button
                className="saveButton"
                onClick={onSave}
            >
                Зберегти
            </Button>
        </Modal>
    );
};

export default observer(ForFansModal);
