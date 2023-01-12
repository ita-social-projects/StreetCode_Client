import './RelatedFiguresModal.styles.scss';
import CancelBtn from "@assets/images/utils/Cancel_btn.svg";

import { Modal } from "antd";
import useMobx from "@stores/root-store";
import { observer } from "mobx-react-lite";

const RelatedFiguresModal = () => {
    const { modalStore } = useMobx();
    const { setModal, modalsState: { relatedFigures } } = modalStore;

    return (
        <Modal className={"relatedFiguresModal"}
            open={relatedFigures.isOpen}
            onCancel={() => setModal('relatedFigures')}
            footer={null}
            maskClosable
            centered
            closeIcon={<CancelBtn />}
        >
            <div className={"relatedFiguresModalContainer"}>
            </div>
        </Modal>
    );
}

export default observer(RelatedFiguresModal);