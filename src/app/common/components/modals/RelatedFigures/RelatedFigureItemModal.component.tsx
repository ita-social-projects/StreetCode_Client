import './RelatedFigureItemModal.styles.scss';

import { observer } from 'mobx-react-lite';
import CancelBtn from '@assets/images/utils/Cancel_btn_mobile.svg';
import useMobx, { useModalContext } from '@stores/root-store';

import { Modal } from 'antd';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

const RelatedFiguresItemModal = () => {
    const { relatedFiguresStore: { relatedFiguresMap } } = useMobx();
    const { modalStore } = useModalContext();
    const { setModal, modalsState: { relatedFigureItem } } = modalStore;

    const relationId = relatedFigureItem.fromCardId!;
    const relation = relatedFiguresMap.get(relationId);

    const handleClick = () => {
        setModal('relatedFigureItem', relation?.id, false);
        window.scrollTo(0, 0);
    };

    return (
        <Modal
            className="mobileModal"
            open={relatedFigureItem.isOpen}
            maskClosable
            centered
            footer={null}
            onCancel={() => setModal('relatedFigureItem')}
            closeIcon={<CancelBtn />}
        >
            <div className="relatedFigureSlide">
                <div
                    className="figureSlideImage"
                    style={{ backgroundImage: `url(${base64ToUrl(
                        relation?.image?.base64,
                        relation?.image?.mimeType,
                    )})` }}
                />
                <div className="figureSlideText">
                    <div className="heading">
                        <p>{relation?.title}</p>
                        {
                            relation?.alias !== null
                                ? (
                                    <p className="aliasText">
                                (
                                        {relation?.alias}
)
                                    </p>
                                )
                                : undefined
                        }
                    </div>
                </div>
            </div>
            <a
                className="redirectionButton"
                href={`../${relation?.url}`}
                onClick={handleClick}
            >
                <p>Перейти на сторінку постаті</p>
            </a>
        </Modal>
    );
};

export default observer(RelatedFiguresItemModal);
