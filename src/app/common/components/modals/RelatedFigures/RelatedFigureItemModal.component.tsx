import './RelatedFigureItemModal.styles.scss';

import { Link } from 'react-router-dom';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import RelatedFigure from '@models/streetcode/related-figure.model';
import useMobx from '@stores/root-store';
import { Modal } from 'antd';
import { observer } from 'mobx-react-lite';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';

const RelatedFiguresItemModal = () => {
    const { imagesStore } = useMobx();
    const { fetchImage, getImage } = imagesStore;
    const { relatedFiguresStore: { relatedFiguresMap }, modalStore } = useMobx();
    const { setModal, modalsState: { relatedFigureItem } } = modalStore;

    const relationId = relatedFigureItem.fromCardId!;
    const relation = relatedFiguresMap.get(relationId);
    
    const BgImg = getImage(relation?.imageId ?? 0)?.url.href;

    console.log('worked!');
    console.log(relation?.title);

    useAsync(
        () => {
        if (relation)
            fetchImage(relation?.imageId)
        },
        [relation?.imageId],
    );
    
    return (
        <Modal className='mobileModal'
            open={relatedFigureItem.isOpen}
            maskClosable
            centered
            footer={null}
            onCancel={() => setModal('relatedFigureItem')}
            closeIcon={<CancelBtn />}
        >
            <div
                className='relatedFigureSlide'
                style={{ backgroundImage: `url(${BgImg})` }}
            >
                <div className="figureSlideText">
                    <div className="heading"> 
                        <p>{relation?.title}</p>
                        {
                            relation?.alias !== null ?
                            <p className='aliasText'>
                                ({relation?.alias})
                            </p>
                            : undefined
                        }
                    </div>
                </div>
            </div>
            <Link 
                className='redirectionButton'
                to={`../streetcode/${relation?.id}`}            
            >
                Перейти на сторінку
            </Link>
        </Modal>
    );
};

export default observer(RelatedFiguresItemModal);
