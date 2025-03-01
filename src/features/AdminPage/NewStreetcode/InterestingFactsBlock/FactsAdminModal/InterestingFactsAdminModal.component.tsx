/* eslint-disable */
import '@features/AdminPage/AdminModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import getNewMinNegativeId from '@app/common/utils/newIdForStore';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import useMobx from '@stores/root-store';

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
import uniquenessValidator from '@/app/common/utils/uniquenessValidator';
import BUTTON_LABELS from "@constants/buttonLabels";
import combinedImageValidator, { checkFile } from '@components/modals/validators/combinedImageValidator';
import VALIDATION_MESSAGES from '@/app/common/constants/validation-messages.constants';
import SUCCESS_MESSAGES from '@/app/common/constants/success-messages.constants';
import REQUIRED_FIELD_MESSAGES from '@/app/common/constants/required_field_messages.constrants';
import MODAL_MESSAGES from '@/app/common/constants/modal-messages.constants';

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

    const handleFileChange = async (param: UploadChangeParam<UploadFile<unknown>>) => {
        if (await checkFile(param.file)) {
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

    const validateFact = uniquenessValidator(
        () => (factsStore.getFactArray.map( (fact) => fact.title)),
        () => (fact?.title),
        VALIDATION_MESSAGES.DUPLICATE_FACT_TITLE,
    );

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

    useEffect(() => {
        if (fileList.length === 0) {
          form.setFieldsValue({ image: undefined });
          form.validateFields(['image']).catch(() => {});
        }
    }, [fileList]);

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

    const onSuccesfulSubmit = (formValues: any) => {
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
        clearModal();
    };

    const handleOk = async () => {
        try {
            await form.validateFields();
            form.submit();
            message.success(SUCCESS_MESSAGES.WOW_FACT_SAVED);
        } catch (error) {
            message.error(VALIDATION_MESSAGES.INVALID_VALIDATION);
        }
    };
    
    const handleRemove = () => {
        setHasUploadedPhoto(false);
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
                    <Popover content={MODAL_MESSAGES.REMINDER_TO_SAVE} trigger="hover">
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
                            rules={[{ required: true, message: REQUIRED_FIELD_MESSAGES.ENTER_HEADER },
                                { validator: validateFact}
                            ]}
                        >
                            <Input maxLength={68} showCount onChange={(e) => onChange('title', e.target.value)} />
                        </Form.Item>

                        <Form.Item
                            name="factContent"
                            label="Основний текст: "
                            rules={[{ required: true, message: REQUIRED_FIELD_MESSAGES.ENTER_MAIN_TEXT }]}
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
                                { required: true, message: REQUIRED_FIELD_MESSAGES.ADD_IMAGE },
                                { validator: combinedImageValidator(true) },
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
                                onRemove={handleRemove}
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
                                {BUTTON_LABELS.SAVE}
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
