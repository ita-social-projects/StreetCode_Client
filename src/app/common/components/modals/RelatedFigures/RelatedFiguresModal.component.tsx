import './RelatedFiguresModal.styles.scss';

import { observer } from 'mobx-react-lite';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import ModalBg from '@assets/images/utils/ModalBg.png';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx, { useModalContext } from '@stores/root-store';
import RelatedFigureItem from '@streetcode/RelatedFiguresBlock/RelatedFigureItem/RelatedFigureItem.component';

import { Modal } from 'antd';

const RelatedFiguresModal = () => {
    const { relatedFiguresStore } = useMobx();
    const { modalStore } = useModalContext();
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
                style={{ background: `url(${ModalBg})` }}
            >
                <h1>Зв’язки історії</h1>
            </div>
            <div className="relatedFiguresReadMoreContentContainer">
                {getRelatedFiguresArray?.map((figure) => (
                    <div key={figure.id } onClick={() => setModal('relatedFigures', streetcodeId, false)}>
                        <RelatedFigureItem
                            key={figure.id}
                            relatedFigure={figure}
                            filterTags={false}
                            setActiveTagId={()=>{}}
                        />
                    </div>
                ))}
            </div>
        </Modal>
    );
};

export default observer(RelatedFiguresModal);
