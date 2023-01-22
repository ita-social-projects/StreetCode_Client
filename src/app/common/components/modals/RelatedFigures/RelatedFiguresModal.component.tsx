import './RelatedFiguresModal.styles.scss';

import { observer } from 'mobx-react-lite';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import ModalBg from '@assets/images/utils/ModalBg.png';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx from '@stores/root-store';

import { Modal } from 'antd';

import RelatedFigureItem
    from '@/features/StreetcodePage/RelatedFiguresBlock/RelatedFigureItem/RelatedFigureItem.component';

const RelatedFiguresModal = () => {
    const { relatedFiguresStore, modalStore } = useMobx();
    const { setModal, modalsState: { relatedFigures } } = modalStore;
    const { fetchRelatedFiguresByStreetcodeId, getRelatedFiguresArray } = relatedFiguresStore;

    const streetcodeId = relatedFigures.fromCardId!;
    useAsync(
        () => {
            if (streetcodeId) {
                fetchRelatedFiguresByStreetcodeId(streetcodeId);
            }
        },
        [streetcodeId],
    );

    return (
        <Modal
            className="relatedFiguresModal"
            open={relatedFigures.isOpen}
            maskClosable
            centered
            footer={null}
            onCancel={() => setModal('relatedFigures', streetcodeId, false)}
            closeIcon={<CancelBtn />}
        >
            <div
                className="relatedFiguresImgContainer"
                style={{
                    background: `url(${ModalBg})`,
                }}
            >
                <h1>Зв’язки історії</h1>
            </div>
            <div className="relatedFiguresContentContainer">
                {getRelatedFiguresArray?.map((figure) => (
                    <RelatedFigureItem
                        key={figure.id}
                        relatedFigure={figure}
                    />
                ))}
            </div>
        </Modal>
    );
};

export default observer(RelatedFiguresModal);
