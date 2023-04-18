import './DonateBtnRectangle.styles.scss';

import useMobx from '@stores/root-store';

const DonateBtnRectangle = () => {
    const { modalStore: { setModal } } = useMobx();
    const onBtnClick = () => setModal('donates');

    return (
        <div className="donateBtnRectangleContainer" onClick={onBtnClick}>
            <div className="donateBtn">
                Задонатити
            </div>
        </div>
    );
};

export default DonateBtnRectangle;
