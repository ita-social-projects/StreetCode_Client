import './SourcesModal.styles.scss';

import { observer } from 'mobx-react-lite';
import sourcesApi from '@api/sources/sources.api';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import ModalBg from '@assets/images/utils/ModalBg.png';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { SourceSubCategory } from '@models/sources/sources.model';
import useMobx from '@stores/root-store';

import { Modal } from 'antd';

const SourcesModal = () => {
    const { sourcesStore: { srcCategoriesMap }, modalStore } = useMobx();
    const { setModal, modalsState: { sources } } = modalStore;
    const { getSubCategoriesByCategoryId } = sourcesApi;

    const categoryId = sources.fromCardId!;
    const category = srcCategoriesMap.get(categoryId);

    const { value } = useAsync(
        () => getSubCategoriesByCategoryId(categoryId),
        [categoryId],
    );
    const subCategories = value as SourceSubCategory[];

    return (
        <Modal
            className="sourcesModal"
            open={sources.isOpen}
            maskClosable
            centered
            footer={null}
            onCancel={() => setModal('sources')}
            closeIcon={<CancelBtn />}
        >
            <div
                className="sourceImgContainer"
                style={{
                    background: `url(${ModalBg})`,
                }}
            >
                <h1>{category?.title}</h1>
            </div>
            <div className="mainContentContainer">
                {subCategories?.map(({ sourceLinks, title }) => (
                    <>
                        <h1 className={(subCategories?.length === 1) ? 'highlightedHeader' : undefined}>
                            {title}
                        </h1>
                        <div className="sectionLinksContainer">
                            {sourceLinks.map(({ id, url }) => (
                                <a key={id} href={url?.href} target="_blank" rel="noreferrer">
                                    {url?.title}
                                </a>
                            ))}
                        </div>
                    </>
                ))}
            </div>
        </Modal>
    );
};

export default observer(SourcesModal);
