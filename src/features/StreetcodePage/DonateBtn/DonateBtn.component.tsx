import './DonateBtn.styles.scss';

import HandWithCoin from '@images/donates/HandWithCoin.svg';

import { useEffect, useRef } from 'react';
import useScrollPosition from '@hooks/scrolling/useScrollPosition/useScrollPosition.hook';
import useMobx from '@stores/root-store';

const DonateBtn = () => {
    const showModalOnScroll = useRef(true);
    const { modalStore: { setModal } } = useMobx();

    useScrollPosition(({ currentPos: { y } }) => {
        if (showModalOnScroll.current) {
            if (Math.abs(y) > document.documentElement.scrollHeight * 0.87) {
                setModal('donates', undefined, true);
                showModalOnScroll.current = false;
            }
        }
    }, 500);

    const onBtnClick = () => {
        setModal('donates');
        showModalOnScroll.current = false;
    };
    return (
        <div className="donateBtnContainer" onClick={onBtnClick}>
            <div className="donateBtnCircle">
                <HandWithCoin />
            </div>
            <h2 className="donateBtnText">
                задонатити
            </h2>
        </div>
    );
};

export default DonateBtn;
