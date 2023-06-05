import './PartnersBtnCircle.styles.scss';

import ShakeHand from '@images/partners/ShakeHand.svg';

import { useModalContext } from '@stores/root-store';

const PartnersBtnCircle = () => {
    const { modalStore: { setModal } } = useModalContext();
    const onBtnClick = () => setModal('partners');

    return (
        <div className="partnersBtnCircleContainer" onClick={onBtnClick}>
            <div className="partnersBtnCircle">
                <ShakeHand />
            </div>
            <h2 className="partnersBtnText">
                Стати партнером
            </h2>
        </div>
    );
};

export default PartnersBtnCircle;
