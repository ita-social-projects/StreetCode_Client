import './RelatedFigureItemModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
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
        relatedFigureItem.isOpen = false;
    };

    return (
        <Modal
            className="mobileModal"
            open={relatedFigureItem.isOpen}
            maskClosable
            centered
            footer={null}
            onCancel={handleClick}
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
            <Link
                className="redirectionButton"
                to={`../${relation?.url}`}
                onClick={handleClick}
            >
                <p>Перейти на сторінку постаті</p>
            </Link>
        </Modal>
    );
};

export default observer(RelatedFiguresItemModal);
