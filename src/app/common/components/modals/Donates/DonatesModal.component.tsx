import './DonatesModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import useMobx from '@stores/root-store';

import { Button, Input, Modal } from 'antd';

const possibleDonateAmounts = [100, 500, 1000];

const DonatesModal = () => {
    const { modalStore } = useMobx();
    const { setModal, modalsState: { donates } } = modalStore;

    const [donateAmount, setDonateAmount] = useState(0);
    const [activeBtnIdx, setActiveBtnIndex] = useState<number>();

    const handleAmountBtnClick = (event: SyntheticEvent, btnIdx: number) => {
        setDonateAmount(possibleDonateAmounts[btnIdx]);
        setActiveBtnIndex(btnIdx);
    };

    const handleModalClose = () => {
        setModal('donates');
        setDonateAmount(0);
    };

    const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(target.value, 10);

        if (Number.isSafeInteger(newValue)) {
            setDonateAmount(newValue);
        } else if (Number.isNaN(newValue)) {
            setDonateAmount(0);
        }
    };

    return (
        <Modal
            className="donatesModal"
            open={donates.isOpen}
            maskClosable
            centered
            footer={null}
            onCancel={handleModalClose}
            closeIcon={<CancelBtn />}
        >
            <div className="donatesModalContent">
                <h1>Підтримай проєкт “Стріткод”</h1>
                <h3>Скажи дякую нашій організації</h3>
                <input
                    onChange={handleInputChange}
                    value={`${donateAmount.toString()}₴`}
                    className={`amountInput ${(donateAmount !== 0) ? 'active' : ''}`}
                />
                <div className="donatesBtnContainer">
                    {possibleDonateAmounts.map((amount, idx) => (
                        <Button
                            key={amount}
                            className={(activeBtnIdx === idx
                                && donateAmount === possibleDonateAmounts[idx]) ? 'active' : ''}
                            onClick={(e) => handleAmountBtnClick(e, idx)}
                        >
                            {amount}
                            ₴
                        </Button>
                    ))}
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
