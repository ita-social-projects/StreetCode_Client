import './RelatedFiguresModal.styles.scss';
import CancelBtn from "@assets/images/utils/Cancel_btn.svg";

import { Modal } from "antd";
import useMobx from "@stores/root-store";
import { observer } from "mobx-react-lite";

const text = `7 (20) березня члени Центральної Ради обрали Михайла Грушевського своїм головою.
\nРішення було прийняте без відома самого Грушевського, що свідчить про його колосальний авторитет.
\n    На той час Грушевський навіть знаходився поза Україною, але повернувся, щоб обійняти посаду.
\n    longTextlongTextlongTextlongTextlongTextlongTextlongTextlongTextlongTextlongTextlongTextlongText`;

const RelatedFiguresModal = () => {
    const { modalStore } = useMobx();
    const { setModal, modalsState: { facts } } = modalStore;

    return (
        <Modal className={"interestingFactsModal"}
            open={facts.isOpen}
            onCancel={() => setModal('facts')}
            footer={null}
            maskClosable
            centered
            closeIcon={<CancelBtn />}
        >
            <div className={"factsImgContainer"}>

            </div>
            <div className={"factsContentContainer"}>
                <h1>Голова Центральної Ради</h1>
                <div className={"factsTextContainer"}>
                    {text}
                </div>
            </div>
        </Modal>
    );
}

export default observer(RelatedFiguresModal);