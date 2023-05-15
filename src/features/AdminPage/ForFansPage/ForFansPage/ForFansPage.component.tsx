import './ForFansPage.style.scss';

import { observer } from 'mobx-react-lite';
import { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import ImagesApi from '@api/media/images.api';
import FileUploader from '@components/FileUploader/FileUploader.component';
import SourceItem from '@features/AdminPage/ForFansPage/ForFansPage/SourceItem';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Image from '@models/media/image.model';
import { SourceCategoryAdmin } from '@models/sources/sources.model';
import useMobx from '@stores/root-store';
import base64ToUrl from '@utils/base64ToUrl.utility';

import {
    Button, Input, Modal, Space, UploadFile,
} from 'antd';

const ForFansPage = () => {
    const { sourcesAdminStore } = useMobx();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const [image, setImage] = useState<Image>();
    const imageId = useRef<number>(0);
    const { addSourceCategory } = sourcesAdminStore;
    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
    };
    useAsync(() => sourcesAdminStore.fetchSourceCategories(), []);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const handleAdd = () => {
        setIsAddModalVisible(true);
    };
    const handleAddOk = () => {
        setIsAddModalVisible(false);
        const src: SourceCategoryAdmin = {
            imageId: imageId.current,
            image,
            title: newTitle,
        };
        setNewTitle('');
        setImage(undefined);
        sourcesAdminStore.addSourceCategory(src);
    };

    const handleAddCancel = () => {
        setNewTitle('');
        setIsAddModalVisible(false);
    };

    const handleChangeNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewTitle(event.target.value);
    };
    return (
        <div className="forFansPage">
            <BlockSlider>
                {sourcesAdminStore.getSourcesAdmin.map((srcCategory: SourceCategoryAdmin) => (
                    <SourceItem srcCategory={srcCategory} />
                ))}
            </BlockSlider>
            <Button
                type="dashed"
                icon={<PlusOutlined />}
                style={{ marginTop: 16 }}
                onClick={handleAdd}
            >
                {/* eslint-disable-next-line no-tabs */}
				Add New Source Category
            </Button>
            <Modal
                title="Add New Source Category"
                open={isAddModalVisible}
                onOk={handleAddOk}
                onCancel={handleAddCancel}
            >
                <Space direction="vertical" size="middle">
                    <Input placeholder="Title" value={newTitle} onChange={handleChangeNewTitle} />
                    <FileUploader
                        multiple={false}
                        accept=".jpeg,.png,.jpg"
                        listType="picture-card"
                        maxCount={1}
                        onPreview={handlePreview}
                        uploadTo="image"
                        onSuccessUpload={(img: Image) => {
                            imageId.current = img.id;
                            setImage(img);
                        }}
                        onRemove={(img) => {
                            ImagesApi.delete(imageId.current);
                        }}
                        defaultFileList={(image)
                            ? [{ name: '',
                                 thumbUrl: base64ToUrl(image?.base64, image?.mimeType),
                                 uid: image?.id.toString(),
                                 status: 'done' }]
                            : []}
                    >
                        <p>Виберіть чи перетягніть файл</p>
                    </FileUploader>
                </Space>
            </Modal>
        </div>
    );
};

export default observer(ForFansPage);
