import './PartnersBtn.styles.scss';

import useMobx from '@stores/root-store';

const PartnersBtn = () => {
    const { modalStore: { setModal } } = useMobx();
    const onBtnClick = () => setModal('partners');

    return (
        <div className="partnersBtnContainer" onClick={onBtnClick}>
            <div className="partnersBtn">
                Стати партнером
            </div>
        </div>
    );
};

export default PartnersBtn;
