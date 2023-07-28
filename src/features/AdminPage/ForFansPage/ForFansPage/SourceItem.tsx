import React, { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ImagesApi from '@api/media/images.api';
import { SourceCategoryAdmin } from '@models/sources/sources.model';
import useMobx from '@stores/root-store';
import base64ToUrl from '@utils/base64ToUrl.utility';

import { Button, Modal } from 'antd';

import SourceModal from './CategoryAdminModal.component';

interface Props {
    srcCategory: SourceCategoryAdmin;
}

const SourceItem = ({ srcCategory }: Props) => {
    const { sourcesAdminStore } = useMobx();
    const { deleteSourceCategory } = sourcesAdminStore;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
    const [title, setTitle] = useState(srcCategory.title);
    const [image, setImage] = useState(srcCategory.image);
    const imageId = useRef<number>(srcCategory.imageId);

    const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsModalDeleteVisible((prevState) => !prevState);
    };

    const handleEdit = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDeleteOk = () => {
        setIsModalDeleteVisible(false);
        deleteSourceCategory(srcCategory.id);
        ImagesApi.delete(srcCategory.imageId);
    };

    const handleDeleteCancel = () => {
        setIsModalDeleteVisible(false);
    };

    useEffect(() => {
        Promise.all([ImagesApi.getById(imageId.current)]).then((r) => setImage(r.at(0)));
    }, []);

    useEffect(() => {
        setTitle(srcCategory.title);
        setImage(srcCategory.image);
    }, [srcCategory.image, srcCategory.title]);

    return (
        <div
            className="sourcesSliderItem"
            style={{ backgroundImage: `url(${base64ToUrl(image?.base64, image?.mimeType)})` }}
        >
            <h1>{title}</h1>
            <div className="sourceActions">
                <Button icon={<EditOutlined />} onClick={handleEdit} />
                <Button icon={<DeleteOutlined />} onClick={handleDelete} />
            </div>
            <Modal
                title="Ви впевнені, що хочете видалити дану категорію?"
                open={isModalDeleteVisible}
                onOk={handleDeleteOk}
                onCancel={handleDeleteCancel}
            />
            <SourceModal
                isModalVisible={isModalVisible}
                onCancel={handleCancel}
                initialData={srcCategory}
            />
        </div>
    );
};
export default SourceItem;
