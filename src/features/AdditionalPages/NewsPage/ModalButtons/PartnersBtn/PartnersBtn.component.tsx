import './PartnersBtn.styles.scss';

import useMobx from '@stores/root-store';

import { becomePartnerEvent } from '@/app/common/utils/googleAnalytics.unility';

const PartnersBtn = () => {
    const { modalStore: { setModal } } = useMobx();
    const onBtnClick = () => {
        setModal('partners');
        becomePartnerEvent('partners_page');
    };

    return (
        <button className='button-sized partner-button' onClick={onBtnClick}>
            Стати партнером
        </button>
    );
};

export default PartnersBtn;
