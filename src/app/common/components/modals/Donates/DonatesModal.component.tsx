import './DonatesModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';
import { Button, Modal } from 'antd';
import {
    ChangeEvent, useEffect, useState,
} from 'react';

import { Checkbox } from 'antd';
import { observer } from 'mobx-react-lite';
import useMobx, { useModalContext } from '@stores/root-store';
import Donation from '@/models/feedback/donation.model';
import DonationApi from '@/app/api/donates/donation.api';

import { supportEvent } from '@/app/common/utils/googleAnalytics.unility';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';

const possibleDonateAmounts = [500, 100, 50];

const DonatesModal = () => {
    const { modalStore } = useModalContext();
    const { setModal, modalsState: { donates } } = modalStore;

    const [donateAmount, setDonateAmount] = useState<number>(0);
    const [activeBtnIdx, setActiveBtnIndex] = useState<number>();
    const [inputStyle, setInputStyle] = useState({ width: '100%' });

    const [isCheckboxChecked, setIsCheckboxChecked] = useState<boolean>(false);

    const windowSize = useWindowSize();

    const handleAmountBtnClick = (btnIdx: number) => {
        setDonateAmount(possibleDonateAmounts[btnIdx]);
        setActiveBtnIndex(btnIdx);
    };

    const handleModalClose = () => {
        setModal('donates');
        setDonateAmount(0);
    };

    const handleDonateInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        let newValue = target.value.replace('₴', '').trim();
        if (!newValue) {
            setDonateAmount(0);
        } else {
            const parsedValue = parseInt(newValue, 10);
            if (Number.isSafeInteger(parsedValue)) {
                setDonateAmount(parsedValue);
            } else {
                setDonateAmount(donateAmount);
            }
        }
    };
    
    const charWidth = windowSize.width > 1024 ? 42 : 21;
    const firstWidth = windowSize.width > 1024 ? 13 : 6;
    const baseValWidth = windowSize.width > 1024 ? 3 : 4;
    const count = (donateAmount.toString().match(/1/g) || []).length; 
    
    var inputWidth = baseValWidth + donateAmount.toString().length * charWidth - count * firstWidth;

    const style = { "--input-width": `${inputWidth}px` } as React.CSSProperties;

    const handlePost = async () => {
        const donation: Donation = { 
            amount: donateAmount, 
            pageUrl: window.location.href
        };

        if (isCheckboxChecked) {
            supportEvent('submit_donate_from_modal');
            
            Promise.all([DonationApi.create(donation)])
            .then(response => {
                window.location.assign(response[0].pageUrl);
            })
            .catch();
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
                <div className={`donateInputContainerWrapper ${(donateAmount !== 0) ? 'active' : ''} `}>
                    <input
                        onChange={handleDonateInputChange}
                        style={{ ...style, width: `var(--input-width)` }}
                        maxLength={14}
                        value={`${donateAmount.toString()}`}
                        className={`amountInput ${(donateAmount !== 0) ? 'active' : ''} `}
                    />
                    <div className={`amountInput ${(donateAmount !== 0) ? 'active' : ''} GryvnaSymbol`}>₴</div>
                </div>
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
                    <Checkbox className={"checkbox-borderline"} checked={isCheckboxChecked} onChange={(e) => setIsCheckboxChecked(e.target.checked)}>Я даю згоду на обробку моїх персональних даних</Checkbox>
                </div>
                <button
                    onClick={handlePost}
                    type="button"
                    disabled={!isCheckboxChecked || donateAmount === 0}
                    className="donatesDonateBtn"
                >
                    Підтримати
                </button>
            </div>
        </Modal>
    );
};

export default observer(DonatesModal);
