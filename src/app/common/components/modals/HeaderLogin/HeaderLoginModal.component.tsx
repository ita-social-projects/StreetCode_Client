import './HeaderLoginModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import useMobx from '@stores/root-store';

import { Button, Modal } from 'antd';

const HeaderLoginModal = () => {
    const { modalStore: { setModal, modalsState: { login } } } = useMobx();

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
                <Button>Стати партнером</Button>
                <Button>Долучитися до команди</Button>
                <Button>Задонатити</Button>
            </div>
        </Modal>
    );
};

export default observer(HeaderLoginModal);
