import './HeaderLoginModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import useMobx, { useModalContext } from '@stores/root-store';

import { Button, Modal } from 'antd';

import { becomePartnerEvent, donateEvent, joinToStreetcode } from '@/app/common/utils/googleAnalytics.unility';
import { useNavigate } from "react-router-dom";

const HeaderLoginModal = () => {
    const { modalStore: { setModal, modalsState: { login } } } = useModalContext();
    const navigate = useNavigate();

    const becomePartnerHandler = () => {
        login.isOpen = false;
        navigate(`../partners-page`);
        becomePartnerEvent('modal');
    }

    return (
        <Modal
            className="loginModal"
            open={login.isOpen}
            maskClosable
            centered
            footer={null}
            onCancel={() => setModal('login')}
            closeIcon={<CancelBtn />}
        >
            <div className="loginModalContent">
                <Button onClick={becomePartnerHandler}>
                    Стати партнером
                </Button>
                <Button onClick={() => joinToStreetcode()}>Долучитися до команди</Button>
                <Button onClick={() => {
                    setModal('donates');
                    setModal('login');
                    donateEvent('header_modal');
                }}
                >
                    Задонатити
                </Button>
            </div>
        </Modal>
    );
};

export default observer(HeaderLoginModal);
