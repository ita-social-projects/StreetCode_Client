import './DonatesModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import {
    ChangeEvent, SyntheticEvent, useCallback,
    useEffect, useRef, useState,
} from 'react';
import useMobx from '@stores/root-store';

import { Button, Input, Modal } from 'antd';

const possibleDonateAmounts = [100, 500, 1000];

const DonatesModal = () => {
    const { modalStore } = useMobx();
    const { setModal, modalsState: { donates } } = modalStore;

    const [donateAmount, setDonateAmount] = useState(0);
    const [activeBtnIdx, setActiveBtnIndex] = useState<number>();
    const [inputStyle, setInputStyle] = useState({ width: '100%' });

    const handleAmountBtnClick = ({ target }: ChangeEvent<HTMLInputElement>, btnIdx: number) => {
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

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1020) {
                setInputStyle({
                    width: `${donateAmount === 0 ? 50 : donateAmount.toString().length * 30}px`,
                });
            } else {
                setInputStyle({
                    width: '100%',
                });
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [donateAmount]);

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
                <h1>Підтримай проєкт</h1>
                <h3>Скажи «Дякую» історії</h3>
                <div className="enterSum">Ввести суму</div>
                <input
                    onChange={handleInputChange}
                    style={inputStyle}
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
                <Button className="donatesDonateBtn">Підтримати</Button>
            </div>
        </Modal>
    );
};

export default observer(DonatesModal);
