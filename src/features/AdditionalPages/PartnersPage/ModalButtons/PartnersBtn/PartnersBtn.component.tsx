import './PartnersBtn.styles.scss';

import { becomePartnerEvent } from '@/app/common/utils/googleAnalytics.unility';
import { useModalContext } from '@/app/stores/root-store';

const PartnersBtn = () => {
    const { modalStore: { setModal } } = useModalContext();
    const onBtnClick = () => {
        setModal('partners');
        becomePartnerEvent('partners_page');
    };

    return (
        <button className="button-sized partner-button" onClick={onBtnClick}>
            Стати партнером
        </button>
    );
};

export default PartnersBtn;
