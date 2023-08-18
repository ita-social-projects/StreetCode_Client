import './PartnersBtnCircle.styles.scss';

import ShakeHand from '@images/partners/ShakeHand.svg';

import { useModalContext } from '@stores/root-store';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';

const PartnersBtnCircle = () => {
    const { modalStore: { setModal } } = useModalContext();
    const onBtnClick = () => setModal('partners');
    const windowSize = useWindowSize();

    return (
        <div className="partnersBtnCircleContainer" onClick={onBtnClick}>
            <div className="partnersBtnCircle">
                <ShakeHand />
            </div>
            { windowSize.width > 1024 && <h2 className="partnersBtnText">Стати партнером</h2> }
        </div>
    );
};

export default PartnersBtnCircle;
