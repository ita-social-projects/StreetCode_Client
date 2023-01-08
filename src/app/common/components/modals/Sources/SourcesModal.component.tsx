import './SourcesModal.styles.scss';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';

import { Modal } from 'antd';

import useMobx from '@stores/root-store';
import { observer } from 'mobx-react-lite';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { SourceSubCategory } from '@models/sources/sources.model';

const SourcesModal = () => {
    const { sourcesStore, modalStore } = useMobx();
    const { setModal, modalsState: { sources } } = modalStore;
    const { srcCategoriesMap, fetchSrcSubCategoriesByCategoryId } = sourcesStore;

    const categoryId = sources.fromCardId!;
    const category = srcCategoriesMap.get(categoryId);

    const { value } = useAsync(
        () => fetchSrcSubCategoriesByCategoryId(categoryId),
        [categoryId]
    );
    const subCategories = value as SourceSubCategory[];

    return (
        <Modal
            className={'sourcesModal'}
            open={sources.isOpen}
            maskClosable
            centered
            footer={null}
            onCancel={() => setModal('sources', undefined)}
            closeIcon={<CancelBtn />}
        >
            <div className={'sourceImgContainer'} style={{
                backgroundImage: `url(${category?.image?.url.href})`,
                backgroundSize: '100% 11.25rem',
            }}>
                <h1>{category?.title}</h1>
            </div>
            <div className={'mainContentContainer'}>
                {subCategories?.map(({ sourceLinks, title }) => (
                    <>
                        <h1 className={(subCategories?.length === 1) ? 'highlightedHeader' : undefined}>
                            {title}
                        </h1>
                        <div className={'sectionLinksContainer'}>
                            {sourceLinks.map(({ id, url }) => (
                                <a key={id} href={url?.href} target='_blank' rel='noreferrer'>
                                    {url?.title}
                                </a>
                            ))}
                        </div>
                    </>
                ))}
            </div>
        </Modal>
    );
}

export default observer(SourcesModal);