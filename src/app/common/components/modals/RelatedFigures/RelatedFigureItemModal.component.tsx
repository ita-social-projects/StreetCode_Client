import './RelatedFigureItemModal.styles.scss';

import { Link } from 'react-router-dom';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import RelatedFigure from '@models/streetcode/related-figure.model';
import useMobx from '@stores/root-store';
import { Modal } from 'antd';
import { observer } from 'mobx-react-lite';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';

interface Props {
    relatedFigure: RelatedFigure;
}

const RelatedFiguresItemModal = ({ relatedFigure }: Props) => {
    const { id, imageId, title, alias } = relatedFigure;

    const { imagesStore } = useMobx();
    const { fetchImage, getImage } = imagesStore;
    const { relatedFiguresStore, modalStore } = useMobx();
    const { setModal, modalsState: { relatedFiguresItem } } = modalStore;

    useAsync(
        () => fetchImage(imageId),
        [imageId],
    );
    
    return (
        <Modal className='mobileModal'
            open={relatedFigure !== undefined}
            maskClosable
            centered
            footer={null}
            onCancel={() => setModal('relatedFigures', relatedFigure.id, false)}
            closeIcon={<CancelBtn />}
        >
            <div
                className='relatedFigureSlide'
                style={{ backgroundImage: `url(${getImage(imageId)?.url.href})` }}
            >
                <div className="figureSlideText">
                    <div className="heading"> 
                        <p>{title}</p>
                        {
                            alias !== null ?
                            <p className='aliasText'>
                                ({alias})
                            </p>
                            : undefined
                        }
                    </div>
                </div>
            </div>
            <Link 
                className='redirectionButton'
                to={`../streetcode/${id}`}            
            >
            </Link>
        </Modal>
    );
};

export default observer(RelatedFiguresItemModal);
