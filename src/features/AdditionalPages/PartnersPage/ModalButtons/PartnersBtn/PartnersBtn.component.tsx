import './PartnersBtn.styles.scss';

import useMobx from '@stores/root-store';

import { becomePartnerEvent } from '@/app/common/utils/googleAnalytics.unility';

const PartnersBtn = () => {
    const { modalStore: { setModal } } = useMobx();
    const onBtnClick = () => setModal('partners');

    return (
        <div className="partnersBtnContainer" onClick={onBtnClick}>
            <div className="partnersBtn" onClick={() => becomePartnerEvent('partners_page')}>
                Стати партнером
            </div>
        </div>
    );
};

export default PartnersBtn;
