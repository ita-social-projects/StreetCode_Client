import './InterestingFactsAdminModal.style.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import useMobx from '@stores/root-store';

import { Modal, Upload } from 'antd';
import FormItem from 'antd/es/form/FormItem';


const InterestingFactsModal = () => {
    const { modalStore } = useMobx();
    const { setModal, modalsState: { addFacts } } = modalStore;
    const [factTitle, setFactTitle] = useState('');
    const [factContent, setFactContent] = useState('');

    const characterCount = factContent.length | 0;

    return (
        <Modal
            className="interestingFactsAdminModal"
            open={addFacts.isOpen}
            onCancel={() => setModal('addFacts')}
            footer={null}
            maskClosable
            centered
            closeIcon={<CancelBtn />}
        >
            <form className="factForm">
                <h2>Wow-Факт</h2>
                <p>Заголовок</p>
                <div className="inputBlock">
                    <input value={factTitle} onChange={(e) => setFactTitle(e.target.value)} />
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
                    rules={[{ required: true, message: 'Завантажте зображення' }]}
                >
                    <Upload
                        multiple={false}
                        accept=".jpeg,.png,.jpg"
                        listType="picture-card"
                        maxCount={1}
                        //  onPreview={handlePreview}
                    >
                        <div className="upload">
                            <InboxOutlined />
                            <p>Виберіть чи перетягніть файл</p>
                        </div>
                    </Upload>
                </FormItem>
            </form>
        </Modal>
    );
};

export default observer(InterestingFactsModal);
