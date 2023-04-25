import './DonationBlock.styles.scss';
import { Button, Checkbox} from 'antd';
import { ChangeEvent, useEffect, useState } from 'react';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import Donation from '@/models/feedback/donation.model';
import DonationApi from '@/app/api/donates/donation.api';

const DonationBlock = () => {
    const [donateAmount, setDonateAmount] = useState<number>(0);

    const [activeBtnIdx, setActiveBtnIndex] = useState<number>();
    const [inputStyle, setInputStyle] = useState({ width: '100%' });

    const [isCheckboxChecked, setIsCheckboxChecked] = useState<boolean>(false);
    
    const windowSize = useWindowSize();

    const possibleDonateAmounts = windowSize.width > 1400 ? [100, 50, 20, 10, 1500, 1000, 500, 200] 
    : [100, 50, 10, 1000, 500, 200];

    const handleAmountBtnClick = (btnIdx: number) => {
        setDonateAmount(possibleDonateAmounts[btnIdx]);
        setActiveBtnIndex(btnIdx);
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
    
    const charWidth = windowSize.width > 1024 ? 26 : 21; 
    const firstWidth = windowSize.width > 1024 ? 8 : 6;

    const count = (donateAmount.toString().match(/1/g) || []).length;
    
    var inputWidth = 5 + donateAmount.toString().length * charWidth - count * firstWidth;

    const style = { "--input-width": `${inputWidth}px` } as React.CSSProperties;

    const handlePost = async () => {
        const donation: Donation = { 
            Amount: donateAmount, 
            PageUrl: window.location.href
        };

        if (isCheckboxChecked) {
            try {
                const response = await DonationApi.create(donation);
                window.location.assign(response.PageUrl);
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
        <div className="donatesBlockContent">
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
            <Button 
                onClick={handlePost}
                disabled={!isCheckboxChecked}
                className="donatesDonateBtn"
            >
                Підтримати
            </Button>
        </div>
    );
};

export default DonationBlock;
