import './DonatesModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';
import { Button, Input, Modal } from 'antd';
import {
    ChangeEvent, SyntheticEvent, useCallback,
    useEffect, useRef, useState,
} from 'react';

import { observer } from 'mobx-react-lite';
import useMobx from '@stores/root-store';
import axios from 'axios';;

const possibleDonateAmounts = [100, 500, 1000];

const DonatesModal = () => {
    const { modalStore } = useMobx();
    const { setModal, modalsState: { donates } } = modalStore;

    const [donateAmount, setDonateAmount] = useState<number>(0);
    const [donateName, setDonateName] = useState<string | undefined>('');
    const [donateComment, setDonateComment] = useState<string | undefined>('');

    const [activeBtnIdx, setActiveBtnIndex] = useState<number>();
    const [inputStyle, setInputStyle] = useState({ width: '100%' });


    const linkBase = 'https://0127-185-244-159-54.ngrok-free.app/api/support/monobank/api/support/monobank';

    const handleAmountBtnClick = (btnIdx: number) => {
        setDonateAmount(possibleDonateAmounts[btnIdx]);
        setActiveBtnIndex(btnIdx);
    };

    const handleModalClose = () => {
        setModal('donates');
        setDonateAmount(0);
    };

    const handleDonateInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(target.value, 10);

        if (Number.isSafeInteger(newValue)) {
            setDonateAmount(newValue);
        } else if (Number.isNaN(newValue)) {
            setDonateAmount(0);
        }
    };

    const handlePost = async () => {
        try {
            const response = await axios.post(`${linkBase}?${donateAmount}&${donateComment}`);
            window.location.replace(response.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1020) {
                setInputStyle({
                    width: `${donateAmount === 0 ? 50 : (donateAmount.toString().length * 30) + 25}px`,
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
                    onChange={handleDonateInputChange}
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
                            onClick={() => handleAmountBtnClick(idx)}
                        >
                            {amount}
                            ₴
                        </Button>
                    ))}
                </div>
                <div className="donatesInputContainer">
                    <Input value={donateName} onChange={(e)=>setDonateName(e.target.value)} 
                        placeholder="Ваше ім’я (необов’язково)" />
                    <Input value={donateComment} onChange={(e)=>setDonateComment(e.target.value)} 
                        placeholder="Коментар (необов’язково)" />
                </div>
                <Button onClick={handlePost} 
                    className="donatesDonateBtn">Підтримати</Button>
            </div>
        </Modal>
    );
};

export default observer(DonatesModal);
