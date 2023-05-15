import './DonateBtnRectangle.styles.scss';

import useMobx from '@stores/root-store';

import { donateEvent } from '@/app/common/utils/googleAnalytics.unility';
const DonateBtnRectangle = () => {
    const { modalStore: { setModal } } = useMobx();
    const onBtnClick = () => {
        setModal('donates');
        donateEvent('partners_page_donate');
    };

    return (
        <button className='button-sized donate-button' onClick={onBtnClick}>
            Задонатити
        </button>       
    );
};

export default DonateBtnRectangle;
