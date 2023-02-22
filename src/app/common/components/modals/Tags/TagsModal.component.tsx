import './TagsModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import ModalBg from '@assets/images/utils/ModalBg.png';
import useMobx from '@stores/root-store';
import { id } from 'date-fns/locale';

import { Modal } from 'antd';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { useRouteId } from '@/app/common/hooks/stateful/useRouter.hook';
// eslint-disable-next-line max-len
import RelatedFigureItem from '@/features/StreetcodePage/RelatedFiguresBlock/RelatedFigureItem/RelatedFigureItem.component';

import TagListModal from './TagsListModal/TagsListModal.component';

const TagsModal = () => {
    const { relatedFiguresStore, modalStore } = useMobx();
    const { setModal, modalsState: { tagsList } } = modalStore;
    const { fetchRelatedFiguresByTagId, getRelatedFiguresArray } = relatedFiguresStore;

    const tagId = 1;
    useAsync(
        () => {
            if (tagId) {
                fetchRelatedFiguresByTagId(tagId);
            }
        },
        [tagId, tagsList],
    );
    return (
        <Modal
            className="tagsModal"
            open={tagsList.isOpen}
            maskClosable
            centered
            footer={null}
            onCancel={() => {
                setModal('tagsList');
            }}
        >
            <div className="headerTagContainer" style={{ background: `url(${ModalBg})` }}>
                <TagListModal streetCodeid={useRouteId()} />
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

export default observer(TagsModal);
