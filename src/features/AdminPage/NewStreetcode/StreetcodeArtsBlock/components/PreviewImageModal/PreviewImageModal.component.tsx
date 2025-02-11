/* eslint-disable @typescript-eslint/no-use-before-define */
import './PreviewImageModal.styles.scss';

import { runInAction } from 'mobx';
import React, { useEffect, useState } from 'react';
import useMobx from '@stores/root-store';

import { Button, Form, Input, Modal } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import BUTTON_LABELS from "@constants/buttonLabels";

interface Props {
    artIdx: number,
    opened: boolean,
    setOpened: React.Dispatch<React.SetStateAction<boolean>>,
}

const PreviewFileModal = ({ opened, setOpened, artIdx }: Props) => {
    const { artStore, streetcodeArtSlideStore } = useMobx();
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
        if (artIdx < 0) {
            return;
        }

        runInAction(() => {
            artStore.arts[artIdx].title = form.getFieldValue('title');
            artStore.arts[artIdx].description = form.getFieldValue('description');
            artStore.toggleMutation();

            replaceTheArtInSlidesIfExist();
        });

        setOpened(false);
        form.resetFields();
    };

    function replaceTheArtInSlidesIfExist() {
        streetcodeArtSlideStore.streetcodeArtSlides = streetcodeArtSlideStore.streetcodeArtSlides.map(
            (slide) => ({ ...slide,
                          streetcodeArts: slide.streetcodeArts.map(
                              (sArt) => {
                                  if (sArt.art.id === artStore.arts[artIdx].id) {
                                      return { ...sArt, art: artStore.arts[artIdx] };
                                  }
                                  return sArt;
                              },
                          ) }),
        );
    }

    useEffect(() => {
        if (artIdx >= 0 && opened) {
            form.setFieldsValue({
                title: artStore.arts[artIdx]?.title ?? '',
                description: artStore.arts[artIdx]?.description ?? '',
            });
        }
        const url = base64ToUrl(
            artStore.arts[artIdx]?.image?.base64,
            artStore.arts[artIdx]?.image?.mimeType,
        );
        setFileProps({
            previewImage: url || '',
            previewTitle: artStore.arts[artIdx]?.title || '',
        });
    }, [opened]);

    return (
        <Modal
            key={artStore.arts[artIdx]?.image?.id ?? 'preview-file-modal'}
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
                    <Button onClick={handleSave} className="saveButton">{BUTTON_LABELS.SAVE}</Button>
                </div>

            </Form>
        </Modal>
    );
};
export default PreviewFileModal;
