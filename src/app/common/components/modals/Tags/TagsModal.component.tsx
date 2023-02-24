import './TagsModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import { observer } from 'mobx-react-lite';
import ModalBg from '@assets/images/utils/ModalBg.png';
import useMobx from '@stores/root-store';

import { Modal } from 'antd';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { useRouteId } from '@/app/common/hooks/stateful/useRouter.hook';
// eslint-disable-next-line max-len
import RelatedFigureItem from '@/features/StreetcodePage/RelatedFiguresBlock/RelatedFigureItem/RelatedFigureItem.component';

import TagListModal from './TagsListModal/TagsListModal.component';

interface Props {
    activeTagId: number,
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>
}

const TagsModal = ({ activeTagId, setActiveTagId } : Props) => {
    const { relatedFiguresStore, modalStore } = useMobx();
    const { setModal, modalsState: { tagsList } } = modalStore;
    const { fetchRelatedFiguresByTagId, getRelatedFiguresArray } = relatedFiguresStore;

    const tagId = activeTagId;
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
            destroyOnClose
            maskClosable
            centered
            footer={null}
            closeIcon={<CancelBtn />}
            onCancel={() => {
                setModal('tagsList');
            }}
        >
            <div className="headerTagContainer" style={{ background: `url(${ModalBg})` }}>
                <TagListModal streetCodeid={useRouteId()} activeTagId={activeTagId} setActiveTagId={setActiveTagId} />
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
