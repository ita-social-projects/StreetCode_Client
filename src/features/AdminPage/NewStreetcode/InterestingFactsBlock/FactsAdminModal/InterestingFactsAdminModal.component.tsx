/* eslint-disable */
import '@features/AdminPage/AdminModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import getNewMinNegativeId from '@app/common/utils/newIdForStore';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import useMobx from '@stores/root-store';

import imageValidator, { checkImageFileType } from '@/app/common/components/modals/validators/imageValidator';

import {
    Button, Form, Input, message, Modal, Popover, UploadFile,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';

import ImagesApi from '@/app/api/media/images.api';
import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Audio from '@/models/media/audio.model';
import Image from '@/models/media/image.model';
import { FactCreate, FactUpdate } from '@/models/streetcode/text-contents.model';

import PreviewFileModal from '../../MainBlock/PreviewFileModal/PreviewFileModal.component';
import { UploadChangeParam } from 'antd/es/upload';
import POPOVER_CONTENT from '@/features/AdminPage/JobsPage/JobsModal/constants/popoverContent';

interface Props {
    fact?: FactCreate,
    open: boolean,
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    onChange: (field: string, value: any) => void
}

const InterestingFactsAdminModal = ({ fact, open, setModalOpen, onChange }: Props) => {
    const { factsStore } = useMobx();
    const [form] = Form.useForm();
    const imageId = useRef<number>(0);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [hasUploadedPhoto, setHasUploadedPhoto] = useState<boolean>(false);

    const checkFile = (file: UploadFile) => checkImageFileType(file.type);

    const handleFileChange = async (param: UploadChangeParam<UploadFile<unknown>>) => {
        if (checkFile(param.file)) {
            setFileList(param.fileList);
        }
    }

    message.config({
        top: 100,
        duration: 2,
        maxCount: 3,
    });

    const clearModal = () => {
        form.resetFields();
        setModalOpen(false);
        setFileList([]);
    };

    useEffect(() => {
        if (fact && open) {
            setHasUploadedPhoto(true);
            imageId.current = fact.imageId;
            form.setFieldsValue({
                title: fact.title,
                factContent: fact.factContent,
            });

            ImagesApi.getById(fact.imageId)
                .then((image) => {
                    const imageInArray: UploadFile[] = [];

                    if (fact) {
                        fact.image = image;
                        imageInArray.push({
                            name: '',
                            url: base64ToUrl(image.base64, image.mimeType),
                            thumbUrl: base64ToUrl(image.base64, image.mimeType),
                            uid: `${fact.id}`,
                            status: 'done',
                            type: image.mimeType,
                        });
                    }

                    form.setFieldsValue({
                        image: imageInArray,
                        imageDescription: fact?.imageDescription ?? image?.imageDetails?.alt,
                    });
                    setFileList(imageInArray);
                });
        }
    }, [fact, open, form]);

    const fillFactWithFormData = (formValues: any, fact?: FactCreate | FactUpdate) => {
        if (!fact) {
            fact = {} as FactCreate;
            fact.id = getNewMinNegativeId(factsStore.getFactArray.map((t) => t.id));
        }

        fact.title = formValues.title;
        fact.factContent = formValues.factContent;
        fact.imageId = imageId.current;
        fact.imageDescription = formValues.imageDescription;

        return fact;
    };

    const setFactUpdateIfItExist = (formValues: any) => {
        factsStore.getFactArray.map((t) => t).forEach((t) => {
            if (formValues.title === t.title
                || formValues.factContent === t.factContent
                || imageId.current === t.imageId) fact = t;
        });
    }

    const onSuccesfulSubmit = (formValues: any) => {
        setFactUpdateIfItExist(formValues);

        if (fact) {
            let item = factsStore.factMap.get(fact.id) as FactUpdate;

            if (item) {
                item = fillFactWithFormData(formValues, item);
            }

            if (fact.image?.imageDetails || formValues.imageDescription) {
                factsStore.setImageDetails(item, fact.image?.imageDetails?.id ?? 0);
            }

        } else {
            const newFact = fillFactWithFormData(formValues);

            if (formValues.imageDescription) {
                factsStore.setImageDetails(newFact, 0);
            }
            factsStore.addFact(newFact);
        }

        setHasUploadedPhoto(false);
        onChange('fact', formValues);
    };

    const handleOk = async () => {
        try {
            await form.validateFields();
            form.submit();
            message.success('Wow-факт успішно додано/оновлено!');
        } catch (error) {
            message.error("Будь ласка, заповніть всі обов'язкові поля та перевірте валідність ваших даних");
        }
    };

    return (
        <div>
            <Modal
                className="modalContainer"
                open={open}
                onCancel={() => {
                    setModalOpen(false);
                }}
                footer={null}
                maskClosable
                centered
                closeIcon={(
                    <Popover content={POPOVER_CONTENT.CANCEL} trigger="hover">
                        <CancelBtn className="iconSize" onClick={clearModal} />
                    </Popover>
                )}
            >
                <div className="modalContainer-content">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onSuccesfulSubmit}
                    >
                        <div className="center">
                            <h2>Wow-Факт</h2>
                        </div>
                        <Form.Item
                            name="title"
                            label="Заголовок: "
                            rules={[{ required: true, message: 'Введіть заголовок, будь ласка' },
                            ]}
                        >
                            <Input maxLength={68} showCount onChange={(e) => onChange('title', e.target.value)} />
                        </Form.Item>

                        <Form.Item
                            name="factContent"
                            label="Основний текст: "
                            rules={[{ required: true, message: 'Введіть oсновний текст, будь ласка' }]}
                        >
                            <TextArea
                                value="Type"
                                maxLength={600}
                                showCount
                                onChange={(e) => onChange('factContent', e.target.value)}
                            />
                        </Form.Item>
                        <FormItem
                            label="Зображення"
                            name="image"
                            rules={[
                                { required: true, message: 'Завантажте фото, будь ласка' },
                                { validator: imageValidator },
                            ]}
                        >
                            <FileUploader
                                uploadTo="image"
                                multiple={false}
                                accept=".jpeg,.png,.jpg,.webp"
                                listType="picture-card"
                                maxCount={1}
                                fileList={fileList}
                                beforeUpload={checkFile}
                                onChange={handleFileChange}
                                onSuccessUpload={(image: Image | Audio) => {
                                    imageId.current = image.id;
                                    setHasUploadedPhoto(true);
                                }}
                                onRemove={() => {
                                    setHasUploadedPhoto(false);
                                }}
                                onPreview={() => {
                                    setPreviewOpen(true);
                                }}
                            >
                                <div>
                                    <InboxOutlined />
                                    <p>{hasUploadedPhoto ? 'Змінити' : '+ Додати'}</p>
                                </div>
                            </FileUploader>
                        </FormItem>

                        <Form.Item
                            name="imageDescription"
                            label="Підпис фото: "
                        >
                            <Input
                                maxLength={200}
                                showCount
                                onChange={(e) => onChange('imageDescription', e.target.value)}
                            />
                        </Form.Item>
                        <div className="center">
                            <Button
                                disabled={fileList?.length === 0 || !hasUploadedPhoto}
                                className="streetcode-custom-button"
                                onClick={() => handleOk()}
                            >
                                Зберегти
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>
            <Popover content="popupContent" trigger="hover" />
            <PreviewFileModal file={fileList?.at(0) ?? null} opened={previewOpen} setOpened={setPreviewOpen} />
        </div>

    );
};

export default observer(InterestingFactsAdminModal);
