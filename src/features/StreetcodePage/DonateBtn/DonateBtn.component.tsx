import './DonateBtn.styles.scss';

import HandWithCoin from '@images/donates/HandWithCoin.svg';

import { useRef } from 'react';
import useScrollPosition from '@hooks/scrolling/useScrollPosition/useScrollPosition.hook';
import useMobx from '@stores/root-store';

const DonateBtn = () => {
    const showModalOnScroll = useRef(true);
    const { modalStore: { setModal } } = useMobx();

    useScrollPosition(({ currentPos: { y } }) => {
        if (showModalOnScroll.current) {
            if (Math.abs(y) > document.documentElement.scrollHeight * 0.845) {
                setModal('donates', undefined, true);
                showModalOnScroll.current = false;
            }
        }
    }, 500);

    return (
        <div
            className="donateBtnContainer"
            onClick={() => {
                setModal('donates');
                showModalOnScroll.current = false;
            }}
        >
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
