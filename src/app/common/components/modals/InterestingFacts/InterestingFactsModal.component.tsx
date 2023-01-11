import './InterestingFactsModal.styles.scss';

import { observer } from 'mobx-react-lite';
import factsApi from '@api/streetcode/text-content/facts.api';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import { Fact } from '@models/streetcode/text-contents.model';
import useMobx from '@stores/root-store';

import { Modal } from 'antd';

const InterestingFactsModal = () => {
    const { factsStore: { factMap }, modalStore } = useMobx();
    const { setModal, modalsState: { facts } } = modalStore;
    const { getFactsByStreetcodeId } = factsApi;

    const factId = facts.fromCardId!;
    const fact = factMap.get(factId);

    return (
        <Modal
            className="interestingFactsModal"
            open={facts.isOpen}
            onCancel={() => setModal('facts')}
            footer={null}
            maskClosable
            centered
            closeIcon={<CancelBtn />}
        >
            <div className="factsImgContainer" />
            <div className="factsContentContainer">
                <h1>{fact?.title}</h1>
                <div className="factsTextContainer">
                    {fact?.factContent}
                </div>
            </div>
        </Modal>
    );
};

export default observer(InterestingFactsModal);
