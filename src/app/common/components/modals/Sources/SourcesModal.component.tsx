import './SourcesModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import sourcesApi from '@api/sources/sources.api';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import CancelBtnMobile from '@assets/images/utils/Cancel_btn_mobile.svg';
import useWindowSize from '@hooks/stateful/useWindowSize.hook';
import useMobx from '@stores/root-store';

import { Modal } from 'antd';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { StreetcodeCategoryContent } from '@/models/sources/sources.model';

const SourcesModal = () => {
    const { sourcesStore: { srcCategoriesMap }, modalStore, streetcodeStore } = useMobx();
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
        <>
            {windowsize.width <= 1024
              && (
                  <Modal
                      className="sourcesModal"
                      open={sources.isOpen}
                      maskClosable
                      centered
                      footer={null}
                      onCancel={() => setModal('sources', categoryId)}
                      closeIcon={<CancelBtnMobile />}
                  >
                      <div className="sourceImgContainer">
                          <h1>{category?.title}</h1>
                      </div>
                      <div className="mainContentContainer">
                          {content?.text}
                      </div>
                  </Modal>
              )}
            {windowsize.width > 1025
              && (
                  <Modal
                      className="sourcesModal"
                      open={sources.isOpen}
                      maskClosable
                      centered
                      footer={null}
                      onCancel={() => setModal('sources', categoryId)}
                      closeIcon={<CancelBtn />}
                  >
                      <div className="sourceImgContainer">
                          <h1>{category?.title}</h1>
                      </div>
                      <div className="mainContentContainer">
                          {content?.text}
                      </div>
                  </Modal>
              )}
        </>
    );
};

export default observer(SourcesModal);
