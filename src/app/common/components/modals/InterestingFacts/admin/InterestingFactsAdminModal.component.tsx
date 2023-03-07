import './InterestingFactsAdminModal.style.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import useMobx from '@stores/root-store';

import { Modal } from 'antd';

const InterestingFactsModal = () => {
    const { factsStore: { factMap }, modalStore } = useMobx();
    const { setModal, modalsState: { adminFacts } } = modalStore;

    // const factId = facts.fromCardId!;
    // const fact = factMap.get(factId);

    const [message, setMessage] = useState('');
    const handleChange = (event:any) => {
        setMessage(event.target.value);
    };
    const characterCount = message.length | 0;

    return (
        <Modal
            // title= " Додати Wow-fact"
            className="interestingFactsAdminModal"
            open={adminFacts.isOpen}
            onCancel={() => setModal('adminFacts')}
            footer={null}
            maskClosable
            centered
            closeIcon={<CancelBtn />}
        >
            <form className="factForm">
                <h2>Wow-Fact</h2>
                <p>Заголовок</p>
                <input className="inputText" />
                <p>Основний текст</p>
                <textarea className="inputText" value={message} maxLength="600" onChange={handleChange} />
                <p>
                    {characterCount}
                      /600
                </p>
                <p>Зображення</p>
                <input type="file" accept="image/png, image/jpeg" />
            </form>
        </Modal>
    );
};

export default observer(InterestingFactsModal);
