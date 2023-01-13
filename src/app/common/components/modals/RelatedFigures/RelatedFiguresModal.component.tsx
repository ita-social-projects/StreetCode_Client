import './RelatedFiguresModal.styles.scss';

import { observer } from 'mobx-react-lite';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import useMobx from '@stores/root-store';

import { Modal } from 'antd';

const RelatedFiguresModal = () => {
    const { modalStore } = useMobx();
    const { setModal, modalsState: { relatedFigures } } = modalStore;

    return (
        <Modal
            className="relatedFiguresModal"
            open={relatedFigures.isOpen}
            onCancel={() => setModal('relatedFigures')}
            footer={null}
            maskClosable
            centered
            closeIcon={<CancelBtn />}
        >
            <div className="relatedFiguresModalContainer" />
        </Modal>
    );
};

export default observer(RelatedFiguresModal);
