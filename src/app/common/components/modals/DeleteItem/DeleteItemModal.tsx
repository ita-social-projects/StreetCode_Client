import React from 'react';

import { Modal } from 'antd';

import useMobx from '@/app/stores/root-store';

const DeleteItemModal = () => {
    const { modalStore: { setModal, modalsState: { deleteItem } } } = useMobx();
    return (
        <Modal
            title="deleteItem"
            open={deleteItem.isOpen}
            onOk={() => {
                if (deleteItem.onSubmit) {
                    deleteItem.onSubmit();
                }
            }}
            onCancel={() => setModal('deleteStreetcode')}
            className="deleteModal"
        />
    );
};
