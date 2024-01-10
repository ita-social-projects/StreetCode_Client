import './DeleteStreetcodeModal.styles.scss';
import { useState } from 'react';

import { observer } from 'mobx-react-lite';
import { useModalContext } from '@stores/root-store';
import { Modal } from 'antd';

import { TITLE, DELETE_STREETCODE } from '../../../constants/modal.constants';

const DeleteStreetcodeModal = () => {
    const { modalStore: { setModal, modalsState: { deleteStreetcode } } } = useModalContext();

    const { fromCardId, isOpen } = deleteStreetcode;

    const [isModalOpen, setIsModalOpen] = useState(isOpen);

    const onCancelHandle = () => setIsModalOpen(false);

    const onOkHandle = () => setModal(DELETE_STREETCODE);

    return (
        <Modal
            title={TITLE}
            open={isModalOpen}
            onOk={onOkHandle}
            onCancel={onCancelHandle}
            className="deleteModal"
        >
            {fromCardId}
        </Modal>
    );
};

export default observer(DeleteStreetcodeModal);
