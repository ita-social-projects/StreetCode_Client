import './DonatesModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import { SyntheticEvent, useState } from 'react';
import useMobx from '@stores/root-store';

import { Button, Input, Modal } from 'antd';

const donateAmountCategories = {
    1: 1000,
    2: 500,
    3: 100,
};

const DonatesModal = () => {
    const { modalStore } = useMobx();
    const [donateAmount, setDonateAmount] = useState(0);

    const { setModal, modalsState: { donates } } = modalStore;

    const handleAmountBtnClick = (event: SyntheticEvent) => {
        const idx = event.currentTarget.getAttribute('data-index')!;
        setDonateAmount((prev) => prev + (donateAmountCategories as any)[idx]);
    };

    return (
        <Modal
            className="donatesModal"
            open={donates.isOpen}
            maskClosable
            centered
            footer={null}
            onCancel={() => {
                setModal('donates');
                setDonateAmount(0);
            }}
            closeIcon={<CancelBtn />}
        >
            <div className="donatesModalContent">
                <h1>Підтримай проєкт “Стріткод”</h1>
                <h3>Скажи дякую нашій організації</h3>
                <span>
                    {donateAmount}
                    ₴
                </span>
                <div className="donatesBtnContainer">
                    <Button data-index="1" onClick={handleAmountBtnClick}>+1000₴</Button>
                    <Button data-index="2" onClick={handleAmountBtnClick}>+500₴</Button>
                    <Button data-index="3" onClick={handleAmountBtnClick}>+100₴</Button>
                </div>
                <div className="donatesInputContainer">
                    <Input placeholder="Ваше ім’я (необов’язково)" />
                    <Input placeholder="Коментар (необов’язково)" />
                </div>
                <Button className="donatesDonateBtn">підтримай</Button>
            </div>
        </Modal>
    );
};

export default observer(DonatesModal);
