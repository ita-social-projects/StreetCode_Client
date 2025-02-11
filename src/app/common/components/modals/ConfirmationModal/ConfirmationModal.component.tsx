import { observer } from 'mobx-react-lite';

import { Modal } from 'antd';

import useMobx, { useModalContext } from '@/app/stores/root-store';
import BUTTON_LABELS from "@constants/buttonLabels";

const ConfirmationModal = () => {
    const { modalStore: { setConfirmationModal, modalsState: { confirmation } } } = useModalContext();
    return (
        <Modal
            title="Підтвердження"
            okText={BUTTON_LABELS.SUBMIT}
            cancelText={BUTTON_LABELS.CANCEL}
            open={confirmation.isOpen}
            onOk={() => {
                if (confirmation.confirmationProps?.onSubmit) {
                    confirmation.confirmationProps.onSubmit();
                }
            }}
            onCancel={() => {
                if (confirmation.confirmationProps?.onCancel) {
                    confirmation.confirmationProps?.onCancel();
                }
                setConfirmationModal('confirmation');
            }}
        >
            {(confirmation.confirmationProps?.text)
                ? <p>{confirmation.confirmationProps.text}</p> : <p>Ви впевнені, що хочете видалити цей елемент?</p>}
        </Modal>
    );
};
export default observer(ConfirmationModal);
