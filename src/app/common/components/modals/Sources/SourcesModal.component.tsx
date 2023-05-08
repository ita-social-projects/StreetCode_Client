import './SourcesModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import sourcesApi from '@api/sources/sources.api';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import ModalBg from '@assets/images/utils/ModalBg.png';
import useMobx from '@stores/root-store';
import htmpReactParser from 'html-react-parser';

import { Modal } from 'antd';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { StreetcodeCategoryContent } from '@/models/sources/sources.model';

const SourcesModal = () => {
    const { sourcesStore: { srcCategoriesMap }, modalStore, streetcodeStore } = useMobx();
    const { setModal, modalsState: { sources } } = modalStore;

    const [content, setContent] = useState<StreetcodeCategoryContent>();
    const categoryId = sources.fromCardId!;
    const category = srcCategoriesMap.get(categoryId);
    useAsync(() => {
        if (streetcodeStore.getStreetCodeId && categoryId) {
            sourcesApi.getCategoryContentByStreetcodeId(streetcodeStore.getStreetCodeId, categoryId)
                .then((cont) => {
                    setContent(cont);
                });
        }
    }, [categoryId]);
    return (
        <Modal
            className="sourcesModal"
            open={sources.isOpen}
            maskClosable
            centered
            footer={null}
            onCancel={() => setModal('sources', categoryId)}
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
                {htmpReactParser(content?.text ?? '')}
            </div>
        </Modal>
    );
};

export default observer(SourcesModal);
