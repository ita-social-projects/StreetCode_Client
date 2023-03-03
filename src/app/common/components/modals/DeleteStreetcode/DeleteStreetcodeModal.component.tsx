import { observer } from 'mobx-react-lite';
import useMobx from '@stores/root-store';
import './DeleteStreetcodeModal.styles.scss';
import { Button, Modal } from 'antd';
import { useState } from 'react';

const DeleteStreetcodeModal = () => {

    const { modalStore: { setModal, modalsState: { deleteStreetcode } } } = useMobx();

    const confirmHandler = () => {
        setTimeout(() => {
            setModal('deleteStreetcode')
        }, 500);
    };

    return (
        <Modal
            title="Delete streetcode"
            open={deleteStreetcode.isOpen}
            onOk = {() => confirmHandler()}
            onCancel={() => setModal('deleteStreetcode')}
            className="deleteModal"
            >
                {deleteStreetcode.fromCardId}
        </Modal>
    );
};

export default observer(DeleteStreetcodeModal);