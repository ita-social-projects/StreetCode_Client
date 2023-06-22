import './InterestingFactsModal.styles.scss';

import { observer } from 'mobx-react-lite';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import useMobx, { useModalContext } from '@stores/root-store';

import { Modal } from 'antd';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { useEffect, useState } from 'react';
import useIsVisible from '@/app/common/hooks/stateful/useIsVisible';

const InterestingFactsModal = () => {
    const millisecondsToHideAfterOpening = 3000;
    const { factsStore: { factMap } } = useMobx();
    const { modalStore } = useModalContext();
    const { setModal, modalsState: { facts } } = modalStore;
    const [descriptionVisible, setDescriptionVisible] = useState<boolean>(false);
    const factId = facts.fromCardId!;
    const fact = factMap.get(factId);
    useEffect(() => {
        if (fact?.image?.imageDetails?.alt) {
            setDescriptionVisible(true);
            setTimeout(() => {
                setDescriptionVisible(false);
            }, millisecondsToHideAfterOpening);
        }
    }, [fact?.image]);

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
            <div className="factsModalContainer">
                <div className="factsImgContainer">
                    <img src={base64ToUrl(fact?.image?.base64, fact?.image?.mimeType)} alt="" />
                    {fact?.image?.imageDetails?.alt ? (
                        <div className={`description-popup ${descriptionVisible ? 'description-popup-visible' : ''}`}>
                            <p>{fact?.image?.imageDetails?.alt}</p>
                        </div>
                    ) : null}
                </div>
                <div className="factsContentContainer">
                    <h1>{fact?.title}</h1>
                    <div className="factsTextContainer">
                        {fact?.factContent}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default observer(InterestingFactsModal);
