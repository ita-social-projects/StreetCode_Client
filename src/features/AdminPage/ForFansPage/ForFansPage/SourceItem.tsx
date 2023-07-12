import React, { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ImagesApi from '@api/media/images.api';
import FileUploader from '@components/FileUploader/FileUploader.component';
import PreviewFileModal from '@features/AdminPage/NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component';
import Image from '@models/media/image.model';
import { SourceCategoryAdmin } from '@models/sources/sources.model';
import useMobx from '@stores/root-store';
import base64ToUrl from '@utils/base64ToUrl.utility';

import {
    Button, Input, Modal, Space, UploadFile,
} from 'antd';

interface Props {
    srcCategory: SourceCategoryAdmin;
}

const SourceItem = ({ srcCategory }: Props) => {
    const { sourcesAdminStore } = useMobx();
    const { deleteSourceCategory, updateSourceCategory } = sourcesAdminStore;
    const [isModalEditVisible, setIsModalEditVisible] = useState(false);
    const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
    const [title, setTitle] = useState(srcCategory.title);
    const [image, setImage] = useState(srcCategory.image);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const imageId = useRef<number>(srcCategory.imageId);
    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
    };

    const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsModalDeleteVisible((prevState) => !prevState);
    };

    const handleEdit = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsModalEditVisible(true);
    };

    const handleEditOk = () => {
        srcCategory.title = title;
        srcCategory.image = image;
        if (imageId.current === 0) srcCategory.imageId = null;
        updateSourceCategory(srcCategory);
        setIsModalEditVisible(false);
    };

    const handleEditCancel = () => {
        setTitle(srcCategory.title);
        setIsModalEditVisible(false);
    };

    const handleDeleteOk = () => {
        setIsModalDeleteVisible(false);
        deleteSourceCategory(srcCategory.id);
        ImagesApi.delete(srcCategory.imageId);
    };

    const handleDeleteCancel = () => {
        setIsModalDeleteVisible(false);
    };

    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    useEffect(() => {
        Promise.all([ImagesApi.getById(imageId.current)]).then((r) => setImage(r.at(0)));
    }, []);
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
                title="Are you sure you want to delete this source?"
                open={isModalDeleteVisible}
                onOk={handleDeleteOk}
                onCancel={handleDeleteCancel}
            />
            <Modal
                title="Edit Source Category"
                open={isModalEditVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
            >
                <Space direction="vertical" size="middle">
                    <Input placeholder="Title" value={title} onChange={handleChangeTitle} />
                    <FileUploader
                        multiple={false}
                        accept=".jpeg,.png,.jpg"
                        listType="picture-card"
                        maxCount={1}
                        onPreview={handlePreview}
                        uploadTo="image"
                        onSuccessUpload={(image: Image) => {
                            imageId.current = image.id;
                            setImage(image);
                        }}
                        onRemove={(img) => {
                            setImage(undefined);
                            imageId.current = 0;
                        }}
                        defaultFileList={(srcCategory)
                            ? [{ name: '',
                                 thumbUrl: base64ToUrl(srcCategory.image?.base64, srcCategory.image?.mimeType),
                                 uid: srcCategory.image?.id.toString(),
                                 status: 'done' }]
                            : []}
                    >
                        <p>Виберіть чи перетягніть файл</p>
                    </FileUploader>
                    <PreviewFileModal opened={previewOpen} setOpened={setPreviewOpen} file={filePreview} />
                </Space>
            </Modal>
        </div>
    );
};
export default SourceItem;
