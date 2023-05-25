import { useModalContext } from '@/app/stores/root-store';
import './DonateBtnRectangle.styles.scss';


import { donateEvent } from '@/app/common/utils/googleAnalytics.unility';

const DonateBtnRectangle = () => {
    const { modalStore: { setModal } } = useModalContext();
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
function modalContext(): { modalStore: { setModal: any; }; } {
    throw new Error('Function not implemented.');
}

