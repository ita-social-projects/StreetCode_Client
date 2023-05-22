import './InterestingFactsModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import Image from '@models/media/image.model';
import useMobx, { useModalContext } from '@stores/root-store';

import { Modal } from 'antd';

import ImagesApi from '@/app/api/media/images.api';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

const InterestingFactsModal = () => {
    const { factsStore: { factMap } } = useMobx();
    const { modalStore } = useModalContext();
    const { setModal, modalsState: { facts } } = modalStore;

    const [image, setImage] = useState<Image>();

    const factId = facts.fromCardId!;
    const fact = factMap.get(factId);

    const imgId = fact?.imageId as number ?? 0;

    useEffect(() => {
        if (imgId > 0)ImagesApi.getById(imgId).then((img) => setImage(img));
    }, [imgId]);

    console.log(fact);
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
                    <img src={base64ToUrl(image?.base64, image?.mimeType)} alt="" />
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
