import './SourcesModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import sourcesApi from '@api/sources/sources.api';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import CancelBtnMobile from '@assets/images/utils/Cancel_btn_mobile.svg';
import useWindowSize from '@hooks/stateful/useWindowSize.hook';
import useMobx, { useModalContext, useStreetcodeDataContext } from '@stores/root-store';
import htmpReactParser from 'html-react-parser';

import { Modal } from 'antd';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { StreetcodeCategoryContent } from '@/models/sources/sources.model';

const SourcesModal = () => {
    const { sourcesStore: { srcCategoriesMap } } = useMobx();
    const { modalStore } = useModalContext();
    const { streetcodeStore } = useStreetcodeDataContext();
    const { setModal, modalsState: { sources } } = modalStore;
    const windowsize = useWindowSize();
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
            closeIcon={windowsize.width <= 1024 ? <CancelBtnMobile /> : <CancelBtn />}
        >
            <div className="sourceImgContainer">
                <h1>{category?.title}</h1>
            </div>
            <div className="mainContentContainer">
                {htmpReactParser(content?.text ?? '')}
            </div>
        </Modal>
    );
};

export default observer(SourcesModal);
