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
            <Form className="forFansForm">
                <h2>Для фанатів</h2>
                <p>Основний текст</p>
                <Editor
                    init={{
                        height: 300,
                        menubar: false,
                        plugins: [
                            'autolink', 'checklist',
                            'lists', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                            'powerpaste', 'formatpainter',
                            'insertdatetime', 'wordcount', 'link',
                        ],
                        toolbar: 'undo redo | bold italic | removeformat | link',
                        content_style: 'body { font-family:Roboto,Helvetica Neue,sans-serif; font-size:14px }',
                    }}
                />
                <FormItem />
                <Button className="saveButton" htmlType="submit">Зберегти</Button>
            </Form>
        </Modal>
    );
};

export default observer(ForFansModal);