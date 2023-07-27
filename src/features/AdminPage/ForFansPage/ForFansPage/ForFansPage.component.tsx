import './ForFansPage.style.scss';

import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import SourceItem from '@features/AdminPage/ForFansPage/ForFansPage/SourceItem';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import useWindowSize from '@hooks/stateful/useWindowSize.hook';
import { SourceCategoryAdmin } from '@models/sources/sources.model';
import useMobx from '@stores/root-store';

import { Button } from 'antd';

import SourceModal from './CategoryAdminModal.component';

const ForFansPage = () => {
    const { sourcesAdminStore } = useMobx();
    const windowsize = useWindowSize();
    const sliderProps = {
        className: 'heightContainer',
        infinite: windowsize.width <= 1024,
        swipe: windowsize.width <= 1024,
        dots: windowsize.width <= 1024,
        variableWidth: windowsize.width <= 1024,
        swipeOnClick: true,
        slidesToShow: windowsize.width >= 1024 ? undefined : windowsize.width < 1024 ? 1 : 2,
        slidesToScroll: windowsize.width >= 1024 ? undefined : windowsize.width < 1024 ? 1 : 2,
        rows: 1,
        initialSlide: 1,
        centerMode: windowsize.width < 1024,
    };

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const handleAdd = () => {
        setIsAddModalVisible(true);
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
    };

    return (
        <div className="forFansPage">
            <BlockSlider {...sliderProps}>
                {sourcesAdminStore.getSourcesAdmin.map((srcCategory: SourceCategoryAdmin) => (
                    <SourceItem srcCategory={srcCategory} key={srcCategory.id} />
                ))}
            </BlockSlider>
            <SourceModal
                isModalVisible={isAddModalVisible}
                onCancel={handleAddCancel}
            />
            <Button icon={<PlusOutlined />} className="streetcode-custom-button" onClick={handleAdd}>
        Додати нову категорію
            </Button>
        </div>
    );
};

export default observer(ForFansPage);
