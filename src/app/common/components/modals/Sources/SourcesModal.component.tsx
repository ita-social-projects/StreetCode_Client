import './SourcesModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
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
    const { sourcesStore: { srcCategoriesMap, srcCategoriesContentMap } } = useMobx();
    const { modalStore } = useModalContext();
    const { setModal, modalsState: { sources } } = modalStore;
    const windowsize = useWindowSize();
    const [content, setContent] = useState<StreetcodeCategoryContent | null>(null);
    const categoryId = sources.fromCardId!;
    const category = srcCategoriesMap.get(categoryId);
    const clickHandle = () => sources.isOpen = false;


    useEffect(() => {
        setContent(srcCategoriesContentMap.get(categoryId) || null);
    }, [categoryId]);
    return (
        <Modal
            className="sourcesModal"
            open={sources.isOpen}
            maskClosable
            centered
            footer={null}
            onCancel={clickHandle}
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
