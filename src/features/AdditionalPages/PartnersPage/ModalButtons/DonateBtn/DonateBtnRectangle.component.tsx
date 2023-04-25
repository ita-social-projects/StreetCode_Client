import './DonateBtnRectangle.styles.scss';

import useMobx from '@stores/root-store';

import { donateEvent } from '@/app/common/utils/googleAnalytics.unility';

const DonateBtnRectangle = () => {
    const { modalStore: { setModal } } = useMobx();
    const onBtnClick = () => setModal('donates');

    return (
        <div className="donateBtnRectangleContainer" onClick={onBtnClick}>
            <div className="donateBtn" onClick={() => donateEvent('partners_page_donate')}>
                Задонатити
            </div>
        </div>
    );
};

export default DonateBtnRectangle;
