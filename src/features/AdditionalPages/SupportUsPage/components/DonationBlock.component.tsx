import './DonationBlock.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';
import { Button, Input, Modal } from 'antd';
import {
    ChangeEvent, SyntheticEvent, useCallback,
    useEffect, useRef, useState,
} from 'react';

import { Checkbox } from 'antd';
import { observer } from 'mobx-react-lite';
import useMobx from '@stores/root-store';
import axios from 'axios';;
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';


const possibleDonateAmounts = [100, 50, 20, 10, 1500, 1000, 500, 200];

const DonationBlock = () => {
    const { modalStore } = useMobx();
    const { setModal, modalsState: { donates } } = modalStore;

    const [donateAmount, setDonateAmount] = useState<number>(0);
    const [donateName, setDonateName] = useState<string | undefined>('');
    const [donateComment, setDonateComment] = useState<string | undefined>('');

    const [activeBtnIdx, setActiveBtnIndex] = useState<number>();
    const [inputStyle, setInputStyle] = useState({ width: '100%' });

    const [isCheckboxChecked, setIsCheckboxChecked] = useState<boolean>(false);
    const windowSize = useWindowSize();

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
    
    const charWidth = windowSize.width > 1024 ? 26 : 21;    // Width of each character in pixels
    const firstWidth = windowSize.width > 1024 ? 8 : 6;

    const count = (donateAmount.toString().match(/1/g) || []).length;
    
    var inputWidth = 5 + donateAmount.toString().length * charWidth - count * firstWidth;

    const style = { "--input-width": `${inputWidth}px` } as React.CSSProperties;

    const handlePost = async () => {
        if (isCheckboxChecked) {
            try {
                const response = await axios.post(`${linkBase}?${donateAmount}&${donateComment}`);
                window.location.replace(response.data);
            } catch (err) {
                console.error(err);
            }
        } else {
            console.log('Checkbox not checked');
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
            <div className="donatesModalContent">
                <h1>Підтримай проєкт</h1>
                <div className="enterSum">Ввести суму</div>
                <div className="donateInputContainerWrapper">
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
                <Button onClick={handlePost}
                    disabled={!isCheckboxChecked}
                    className="donatesDonateBtn"
                >Підтримати</Button>
            </div>  
    );
};

export default DonationBlock;
