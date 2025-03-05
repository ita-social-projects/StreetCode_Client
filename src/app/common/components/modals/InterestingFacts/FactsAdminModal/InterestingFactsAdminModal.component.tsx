import './InterestingFactsAdminModal.style.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import useMobx, { useModalContext } from '@stores/root-store';

import { Form, Modal, Upload } from 'antd';
import FormItem from 'antd/es/form/FormItem';

const InterestingFactsModal = () => {
    const { modalStore } = useModalContext();
    const { factsStore, imagesStore: { getImageArray } } = useMobx();
    const { setModal, modalsState: { adminFacts } } = modalStore;
    const [factContent, setFactContent] = useState('');

    const characterCount = factContent.length | 0;

    return (
        <Modal
            className="interestingFactsAdminModal"
            open={adminFacts.isOpen}
            onCancel={() => setModal('adminFacts')}
            footer={null}
            maskClosable
            centered
            closeIcon={<CancelBtn />}
        >
            <Form className="factForm">
                <h2>Wow-Факт</h2>
                <p>Заголовок</p>
                <div className="inputBlock">
                    <Form.Item name="title">
                        <input />
                    </Form.Item>
                    <p>Основний текст</p>
                    <textarea value={factContent} maxLength={600} onChange={(e) => setFactContent(e.target.value)} />
                    <p className="characterCounter">
                        {characterCount}
                        /600
                    </p>
                </div>
                <p>Зображення:</p>
                <FormItem
                    name="picture"
                    className=""
                >
                    <Upload
                        multiple={false}
                        accept=".jpeg,.png,.jpg,.webp"
                        listType="picture-card"
                        maxCount={1}
                    >
                        <div className="upload">
                            <InboxOutlined />
                            <p>Виберіть чи перетягніть файл</p>
                        </div>
                    </Upload>
                </FormItem>
            </Form>
        </Modal>
    );
};

export default observer(InterestingFactsModal);
