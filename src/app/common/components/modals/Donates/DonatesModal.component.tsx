import './DonatesModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import { ChangeEvent, useEffect, useState } from 'react';
import donateButtonRequest from '@app/common/requests/donateButtonRequest';
import { PositiveNumber } from '@constants/custom-types.constants';
import { useModalContext } from '@stores/root-store';

import { Button, Checkbox, Modal } from 'antd';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';

const possibleDonateAmounts = [500, 100, 50];

// eslint-disable-next-line complexity
const DonatesModal = () => {
    const { modalStore } = useModalContext();
    const { setModal, modalsState: { donates } } = modalStore;

    const [donateAmount, setDonateAmount] = useState<number>(0);
    const [inputStyle, setInputStyle] = useState({ width: '100%' });

    const [isCheckboxChecked, setIsCheckboxChecked] = useState<boolean>(false);

    const windowSize = useWindowSize();

    const handleAmountBtnClick = (btnIdx: number) => {
        setDonateAmount(possibleDonateAmounts[btnIdx]);
    };

    const handleModalClose = () => {
        donates.isOpen = false;
        setDonateAmount(0);
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

    const charWidth = windowSize.width > 1024 ? 42 : 21;
    const firstWidth = windowSize.width > 1024 ? 13 : 6;
    const baseValWidth = windowSize.width > 1024 ? 2 : 1;
    const count = (donateAmount.toString().match(/1/g) || []).length;
    const zeroCount = (donateAmount.toString().match(/[0689]/g) || []).length;

    const inputWidth = baseValWidth + donateAmount.toString().length
     * charWidth - count * firstWidth + zeroCount * baseValWidth;

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
                        style={{ ...style, width: 'var(--input-width)' }}
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
                        <a className="privacyPolicy" href="/privacy-policy">персональних даних</a>
                    </Checkbox>
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
