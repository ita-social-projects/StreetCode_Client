import './DonateBtn.styles.scss';

import HandWithCoin from '@images/donates/HandWithCoin.svg';

import { useRef } from 'react';
import useScrollPosition from '@hooks/scrolling/useScrollPosition/useScrollPosition.hook';
import useWindowSize from '@hooks/stateful/useWindowSize.hook';
import useMobx, { useModalContext } from '@stores/root-store';

import { donateEvent } from '@/app/common/utils/googleAnalytics.unility';

const DonateBtn = () => {
    const showModalOnScroll = useRef(true);
    const { modalStore: { setModal } } = useModalContext();
    const windowSize = useWindowSize();
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
        donateEvent('floating_button');
    };
    return (
        <div className="donateBtnContainer" onClick={onBtnClick}>
            <div className="donateBtnCircle">
                <HandWithCoin />
            </div>
            { windowSize.width > 1024 && <h2 className="donateBtnText">задонатити</h2> }
        </div>
    );
};

export default DonateBtn;
