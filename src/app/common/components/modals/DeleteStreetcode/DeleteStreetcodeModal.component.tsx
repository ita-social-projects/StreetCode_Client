import './DeleteStreetcodeModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import useMobx from '@stores/root-store';

import { Button, Modal } from 'antd';

const DeleteStreetcodeModal = () => {
    const { modalStore: { setModal, modalsState: { deleteStreetcode } } } = useMobx();

    const confirmHandler = () => {
        setModal('deleteStreetcode');
    };

    return (
        <Modal
            title="Delete streetcode"
            open={deleteStreetcode.isOpen}
            onOk={() => confirmHandler()}
            onCancel={() => setModal('deleteStreetcode')}
            className="deleteModal"
        >
            {deleteStreetcode.fromCardId}
        </Modal>
    );
};

export default observer(DeleteStreetcodeModal);
