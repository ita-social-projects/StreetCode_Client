import { observer } from 'mobx-react-lite';
import BUTTON_LABELS from '@constants/buttonLabels';
import './ConfirmationModalstyle..scss';
import CancelBtn from '@images/utils/Cancel_btn.svg';
import { Modal } from 'antd';

// eslint-disable-next-line import/extensions
import { useModalContext } from '@/app/stores/root-store';

const ConfirmationModal = () => {
    const { modalStore: { setConfirmationModal, modalsState: { confirmation } } } = useModalContext();
    return (
        <Modal
            className="confirmation-modal"
            closeIcon={<CancelBtn />}
            okText={BUTTON_LABELS.SUBMIT}
            cancelText={BUTTON_LABELS.CANCEL}
            open={confirmation.isOpen}
            onOk={() => {
                if (confirmation.confirmationProps?.onSubmit) {
                    confirmation.confirmationProps.onSubmit();
                }
                confirmation.isOpen = false;
            }}
            onCancel={() => {
                if (confirmation.confirmationProps?.onCancel) {
                    confirmation.confirmationProps?.onCancel();
                }
                setConfirmationModal('confirmation');
            }}
        >
            {(confirmation.confirmationProps?.text)
                ? <p className="confirmation-text">{confirmation.confirmationProps.text}</p> : <p>Ви впевнені, що хочете видалити цей елемент?</p>}
        </Modal>
    );
};
export default observer(ConfirmationModal);
