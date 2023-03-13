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
    const { setModal, modalsState: { editFacts } } = modalStore;

    const [message, setMessage] = useState('');
    const handleChange = (event:any) => {
        setMessage(event.target.value);
    };
    const characterCount = message.length | 0;

    return (
        <Modal
            className="interestingFactsAdminModal"
            open={editFacts.isOpen}
            onCancel={() => setModal('editFacts')}
            footer={null}
            maskClosable
            centered
            closeIcon={<CancelBtn />}
        >
            <form className="factForm">
                <h2>Wow-Факт</h2>
                <p>Заголовок</p>
                <div className="inputBlock">
                    <input />
                    {/* value={fact?.title}
                     //onChange={(e) => setTitle(e.target.value)} */}
                    <p>Основний текст</p>
                    <textarea value={message} maxLength="600" onChange={handleChange} />
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
