import './InterestingFactsModal.styles.scss';

import { observer } from 'mobx-react-lite';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import Image from '@models/media/image.model';
import useMobx from '@stores/root-store';

import { Modal } from 'antd';

import ImagesApi from '@/app/api/media/images.api';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

const InterestingFactsModal = () => {
    const { factsStore: { factMap }, modalStore } = useMobx();
    const { setModal, modalsState: { facts } } = modalStore;

    const factId = facts.fromCardId!;
    const fact = factMap.get(factId);

    const imgId = fact?.imageId as number ?? 0;
    let value: any;
    let image: Image;
    let url: any;
    if(imgId !== 0 ){
        value  = useAsync(() => ImagesApi.getById(imgId), [imgId]);
        image = value as Image;
        url = base64ToUrl(image?.base64, image?.mimeType);
    }
    // const { value } = useAsync(() => ImagesApi.getById(imgId), [imgId]);
    // const image = value as Image; 

    // const url = base64ToUrl(image?.base64, image?.mimeType);

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
                    <img src={url} alt="" />
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
