'./AdditionalTextBlockAdminForm.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import useMobx from '@stores/root-store';
import { Editor } from '@tinymce/tinymce-react';

import { Button, Form, Modal, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';

import { SourceCategoryName, StreetcodeCategoryContent } from '@/models/sources/sources.model';

interface Props {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    allCategories: SourceCategoryName[],
}

const AdditionalTextBlockAdminForm = ({ open, setOpen, allCategories } : Props) => {
    const { sourceCreateUpdateStreetcode } = useMobx();
    const editorRef = useRef<Editor | null>(null);
    const categoryUpdate = useRef<StreetcodeCategoryContent | null>();
    const [availableCategories, setAvailableCategories] = useState<SourceCategoryName[]>([]);

    const [form] = Form.useForm();
    const getAvailableCategories = (): SourceCategoryName[] => {
        const selected = sourceCreateUpdateStreetcode.streetcodeCategoryContents
            .map((srcCatContent) => srcCatContent.sourceLinkCategoryId);
        const available = allCategories.filter((c) => selected.indexOf(c.id) < 0);
        if (categoryUpdate.current) {
            available.push(allCategories[allCategories.findIndex((c) => c.id === categoryUpdate
                .current?.sourceLinkCategoryId)]);
        }
        return available;
    };

    useEffect(() => {
        categoryUpdate.current = sourceCreateUpdateStreetcode.ElementToUpdate;
        setAvailableCategories(getAvailableCategories());
        if (categoryUpdate.current && open) {
            editorRef.current?.editor?.setContent(categoryUpdate.current.text ?? '');
            form.setFieldValue('category', categoryUpdate.current.sourceLinkCategoryId);
        } else {
            categoryUpdate.current = null;
            editorRef.current?.editor?.setContent('');
            form.setFieldValue('category', (availableCategories.length > 0 ? availableCategories[0].id : undefined));
        }
    }, [open]);

    const onSave = (values:any) => {
        const elementToUpdate = sourceCreateUpdateStreetcode.ElementToUpdate;
        if (elementToUpdate) {
            sourceCreateUpdateStreetcode
                .updateElement(
                    sourceCreateUpdateStreetcode.indexUpdate,
                    { ...elementToUpdate,
                      sourceLinkCategoryId: values.category,
                      text: editorRef.current?.editor?.getContent() ?? '' },
                );
        } else {
            sourceCreateUpdateStreetcode
                .addSourceCategoryContent({
                    id: sourceCreateUpdateStreetcode.streetcodeCategoryContents.length,
                    sourceLinkCategoryId: values.category,
                    text: editorRef.current?.editor?.getContent() ?? '',
                    streetcodeId: categoryUpdate.current?.streetcodeId ?? 0,
                });
        }
        setOpen(false);
        sourceCreateUpdateStreetcode.indexUpdate = -1;
    };

    return (
        // <Modal
        //     className="AdditionalTextBlock"
        //     open={open}
        //     onCancel={() => {
        //         setOpen(false); sourceCreateUpdateStreetcode.indexUpdate = -1;
        //     }}
        //     footer={null}
        //     maskClosable
        //     centered
        //     closeIcon={<CancelBtn />}
        // >
        <>
            <h2>Текст підготовлений спільно з...</h2>
            <Form form={form} onFinish={onSave}>
                <FormItem name="category">
                    <Select
                        key="selectAdditionalTextBlock"
                        className="category-select-input"
                    >
                        {availableCategories
                            .map((c) => <Select.Option key={`${c.id}`} value={c.id}>{c.title}</Select.Option>)}
                    </Select>
                </FormItem>

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
                        toolbar: 'undo redo blocks bold italic link align | underline superscript subscript '
                     + 'formats blockformats align | removeformat strikethrough ',
                        content_style: 'body { font-family:Roboto,Helvetica Neue,sans-serif; font-size:14px }',
                    }}
                />
                <Form.Item>
                    <Button htmlType="submit">
                Зберегти
                    </Button>
                </Form.Item>
            </Form>
        </>
        // </Modal>
    );
};

export default observer(AdditionalTextBlockAdminForm);
