import './DonationBlock.styles.scss';

import { ChangeEvent, useEffect, useState } from 'react';
import donateButtonRequest from '@app/common/requests/donateButtonRequest';
import { PositiveNumber } from '@constants/custom-types.constants';

import { Button, Checkbox } from 'antd';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';

// eslint-disable-next-line complexity
const DonationBlock = () => {
    const [donateAmount, setDonateAmount] = useState<number>(0);
    const [activeBtnIdx, setActiveBtnIndex] = useState<number>();
    const [inputStyle, setInputStyle] = useState({ width: '100%' });
    const [isCheckboxChecked, setIsCheckboxChecked] = useState<boolean>(false);

    const windowSize = useWindowSize();

    const possibleDonateAmounts = windowSize.width > 1400 ? [10, 20, 50, 100, 200, 500, 1000, 1500]
        : [10, 50, 100, 200, 500, 1000];

    const handleAmountBtnClick = (btnIdx: number) => {
        setDonateAmount(possibleDonateAmounts[btnIdx]);
        setActiveBtnIndex(btnIdx);
    };

    const handleDonateInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        const newValue = target.value.replace(/\D/g, '');
        if (newValue.includes('-')) {
            return;
        }
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

    const charWidth = windowSize.width > 1400 ? 26 : 21;
    const firstWidth = windowSize.width > 1400 ? 8 : 6;
    const zeroWidth = windowSize.width > 1400 ? 2 : 1;

    const count = (donateAmount.toString().match(/1/g) || []).length;
    const zeroCount = (donateAmount.toString().match(/[0689]/g) || []).length;

    const inputWidth = donateAmount.toString().length * charWidth - count * firstWidth + zeroCount * zeroWidth;

    const style = { '--input-width': `${inputWidth}px` } as React.CSSProperties;

    const handlePost = () => {
        if (isCheckboxChecked && donateAmount > 0) {
            donateButtonRequest(donateAmount as PositiveNumber);
        }
    };

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
            <div className={`donateInputContainerWrapper ${(donateAmount !== 0) ? 'active' : ''} `}>
                <input
                    onChange={handleDonateInputChange}
                    style={{ ...style, width: 'calc(var(--input-width) + 2px)' }}
                    placeholder="0"
                    maxLength={14}
                    value={donateAmount === 0 ? '' : donateAmount}
                    className={`amountInput ${(donateAmount !== 0) ? 'active' : ''} `}
                />
                <div className={`amountInput ${(donateAmount !== 0) ? 'active' : ''} GryvnaSymbol`}>₴</div>
            </div>
            <div className="donatesBtnContainer">
                {possibleDonateAmounts.map((amount, idx) => (
                    <Button
                        key={amount}
                        className={(donateAmount === possibleDonateAmounts[idx]) ? 'active' : ''}
                        onClick={() => handleAmountBtnClick(idx)}
                    >
                        {amount}
                        ₴
                    </Button>
                ))}
            </div>
            <div className="donatesInputContainer">
                <Checkbox
                    className="checkbox-borderline"
                    checked={isCheckboxChecked}
                    onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                >
                    Я даю згоду на обробку моїх
                    {' '}
                    <a href="/privacy-policy">персональних даних</a>
                </Checkbox>
            </div>
            <button
                onClick={handlePost}
                disabled={!isCheckboxChecked || donateAmount === 0}
                className="donatesDonateBtn"
                type="button"
            >
                Підтримати
            </button>
        </div>
    );
};

export default DonationBlock;
