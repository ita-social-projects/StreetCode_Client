import './ForFansPage.style.scss';

import { observer } from 'mobx-react-lite';
import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import ImagesApi from '@api/media/images.api';
import FileUploader from '@components/FileUploader/FileUploader.component';
import SourceItem from '@features/AdminPage/ForFansPage/ForFansPage/SourceItem';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useWindowSize from '@hooks/stateful/useWindowSize.hook';
import Image from '@models/media/image.model';
import { SourceCategoryAdmin } from '@models/sources/sources.model';
import useMobx from '@stores/root-store';

import {
    Button, Form, Input, Modal, UploadFile,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';

const ForFansPage = () => {
    const { sourcesAdminStore } = useMobx();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const [form] = Form.useForm();
    const imageId = useRef<number>(0);
    const { addSourceCategory } = sourcesAdminStore;
    const [image, setImage] = useState<Image>();
    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
    };
    useAsync(() => sourcesAdminStore.fetchSourceCategories(), []);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const handleAdd = () => {
        setIsAddModalVisible(true);
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
        form.resetFields();
    };
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

    async function onSubmit(formData: any) {
        setIsAddModalVisible(false);
        const newSource: SourceCategoryAdmin = {
            id: 0,
            title: formData.title,
            imageId: imageId.current,
            image,
        };
        console.log(newSource);
        await addSourceCategory(newSource);
        form.resetFields();
    }
    return (
        <div className="forFansPage">
            <BlockSlider
                {...sliderProps}
            >
                {sourcesAdminStore.getSourcesAdmin.map((srcCategory: SourceCategoryAdmin) => (
                    <SourceItem srcCategory={srcCategory} key={srcCategory.id} />
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
                onCancel={handleAddCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onSubmit}
                >
                    <FormItem
                        name="title"
                        label="Назва: "
                        rules={[{ required: true, message: 'Введіть назву' }]}
                    >
                        <Input placeholder="Title" />
                    </FormItem>
                    <FormItem
                        name="image"
                        label="Картинка: "
                        rules={[{ required: true, message: 'Додайте зображення' }]}
                    >
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
                        >
                            <p>Виберіть чи перетягніть файл</p>
                        </FileUploader>
                    </FormItem>
                    <div className="center">
                        <Button className="streetcode-custom-button" onClick={() => form.submit()}>
                            Зберегти
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default observer(ForFansPage);
