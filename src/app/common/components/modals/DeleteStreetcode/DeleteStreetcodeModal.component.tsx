import './DeleteStreetcodeModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { useModalContext } from '@stores/root-store';
import { Modal } from 'antd';

import { TITLE, DELETE_STREETCODE } from '../../../constants/modal.constants';

const DeleteStreetcodeModal = () => {
    const { modalStore: { setModal, modalsState: { deleteStreetcode } } } = useModalContext();
    const clickHandle = () => setModal(DELETE_STREETCODE);

    const { isOpen, fromCardId } = deleteStreetcode;

    return (
        <Modal
            title={TITLE}
            open={isOpen}
            onOk={clickHandle}
            onCancel={clickHandle}
            className="deleteModal"
        >
            {fromCardId}
        </Modal>
    );
};

export default observer(DeleteStreetcodeModal);
