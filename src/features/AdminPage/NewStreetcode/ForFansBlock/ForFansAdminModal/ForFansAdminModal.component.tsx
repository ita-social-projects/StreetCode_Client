'./ForFansAdminModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import useMobx from '@stores/root-store';
import { Editor } from '@tinymce/tinymce-react';

import { Button, Form, Modal, Upload } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import { SourceCategory } from '@/models/sources/sources.model';

interface Props {
    sourceCategory? : SourceCategory
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const ForFansModal = ({ sourceCategory, open, setOpen } : Props) => {
    const [forFansContent, setForFansContent] = useState('');
    const [form] = Form.useForm();
    const { factsStore } = useMobx();

    useEffect(() => {
        if (sourceCategory && open) {
            form.setFieldsValue({
                title: sourceCategory.title,
                imageId: sourceCategory.imageId,
                streetcodeId: sourceCategory.streetcodeId,
                subCategories: sourceCategory.subCategories,
            });
        }
    }, [sourceCategory, open, form]);

    // NOTE: somehow add fetching for new streetcode
    // useEffect(() => {
    //   factsStore.fetchAllStreetcode();
    // }, [some object]);

    const handleEditorChange = (content: string) => {
        setForFansContent(content);
    };

    const onSuccesfulSubmit = (formValues:any) => {
        if (sourceCategory) {
            const item = factsStore.factMap.get(sourceCategory.id); // timelineItemStore.timelineItemMap.get(timelineItem.id);
            if (item) {
                item.title = formValues.title;
                item.imageId = formValues.imageId;
            }
        } else {
            // FIX: figure out how to add streetcode here!
            const newCategory: SourceCategory = { id: sourceCategory.factMap.size,
                                                  title: formValues.title,
                                                  imageId: formValues.imageId,
                                                  streetcodeId: formValues.streetcodeId,
                                                  subCategories: formValues.subCategories,
                                                  forFansContent };
            sourceCategory.addForFansAdmin(newCategory);

            setOpen(false);
            form.resetFields();
        }
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
            <Form className="forFansForm" onFinish={onSuccesfulSubmit}>
                <h2>Для фанатів</h2>
                <p>Основний текст</p>
                <button id="sectionButton">Розділ</button>
                <Editor
                    initialValue={forFansContent}
                    init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount',
                        ],
                        toolbar:
                                'undo redo | formatselect | bold italic backcolor | \
                                alignleft aligncenter alignright alignjustify | \
                                bullist numlist outdent indent | removeformat | help',
                    }}
                    onEditorChange={handleEditorChange}
                />
                <FormItem />
                <Button className="saveButton" htmlType="submit">Зберегти</Button>
            </Form>
        </Modal>
    );
};

export default observer(ForFansModal);
