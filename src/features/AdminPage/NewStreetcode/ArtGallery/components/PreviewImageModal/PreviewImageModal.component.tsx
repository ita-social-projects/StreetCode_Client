import './PreviewImageModal.styles.scss';

import React, { useEffect, useState } from 'react';

import { Button, Form, Input, Modal } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { StreetcodeArtCreateUpdate } from '@/models/media/streetcode-art.model';

interface Props {
    opened: boolean,
    setOpened: React.Dispatch<React.SetStateAction<boolean>>,
    streetcodeArt: StreetcodeArtCreateUpdate;
    arts: StreetcodeArtCreateUpdate[],
    setArts: React.Dispatch<React.SetStateAction<StreetcodeArtCreateUpdate[]>>,
    onChange: (field: string, value: any) => void,
}

const PreviewFileModal = ({
    opened, setOpened, streetcodeArt, arts, setArts, onChange,
}: Props) => {
    const [fileProps, setFileProps] = useState<{
      previewImage: string;
      previewTitle: string;
    }>({ previewImage: '', previewTitle: '' });
    const [form] = Form.useForm();

    const handleCancel = () => {
        setOpened(false);
        form.resetFields();
    };

    const handleSave = () => {
        const updated = arts.find((x) => x.art.image?.id === streetcodeArt.art.image?.id);
        if (!updated) {
            return;
        }
        updated.art.title = form.getFieldValue('title');
        updated.art.description = form.getFieldValue('description');

        setArts([...arts]);
        setOpened(false);
        onChange('art', updated.art);
        form.resetFields();
    };

    useEffect(() => {
        if (streetcodeArt && opened) {
            form.setFieldsValue({
                title: streetcodeArt?.art.title ?? '',
                description: streetcodeArt?.art.description ?? '',
            });
        }
        const url = base64ToUrl(streetcodeArt?.art.image?.base64, streetcodeArt?.art.image?.mimeType);
        setFileProps({
            previewImage: url || '',
            previewTitle: streetcodeArt?.art.title || '',
        });
    }, [opened]);

    return (
        <Modal
            key={streetcodeArt?.art.image?.id ?? 'preview-file-modal'}
            open={opened}
            title="Додаткові дані"
            footer={null}
            onCancel={handleCancel}
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleSave}
            >
                <div className="artPreviewModal">
                    <img alt="uploaded" src={fileProps.previewImage} />

                    <FormItem
                        name="title"
                        label="Назва"
                    >
                        <Input
                            showCount
                            maxLength={150}
                        />
                    </FormItem>
                    <FormItem
                        name="description"
                        label="Опис"
                    >
                        <TextArea
                            showCount
                            maxLength={400}
                        />
                    </FormItem>
                    <Button onClick={handleSave} className="saveButton">Зберегти</Button>
                </div>

            </Form>
        </Modal>
    );
};
export default PreviewFileModal;
