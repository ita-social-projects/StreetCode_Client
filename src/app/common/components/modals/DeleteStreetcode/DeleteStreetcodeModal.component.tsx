import { observer } from 'mobx-react-lite';
import useMobx from '@stores/root-store';

import { Button, Modal } from 'antd';
import { useState } from 'react';

const DeleteStreetcodeModal = () => {

    const { modalStore: { setModal, modalsState: { deleteStreetcode } } } = useMobx();

    // const [open, setOpen] = useState(false);
    // const [confirmLoading, setConfirmLoading] = useState(false);
    // const [modalText, setModalText] = useState('Content of the modal');

    // const showModal = () => {
    //     setOpen(true);
    // };

    // const handleOk = () => {
    //     setModalText('The modal will be closed after two seconds');
    //     setConfirmLoading(true);
    //     setTimeout(() => {
    //     setOpen(false);
    //     setConfirmLoading(false);
    //     }, 2000);
    // };

    // const handleCancel = () => {
    //     console.log('Clicked cancel button');
    //     setOpen(false);
    // };

    return (
        <Modal
            title="Delete streetcode"
            open={deleteStreetcode.isOpen}
            onCancel={() => setModal('deleteStreetcode')}
            >
                {deleteStreetcode.fromCardId}
        </Modal>
    );
};

export default observer(DeleteStreetcodeModal);