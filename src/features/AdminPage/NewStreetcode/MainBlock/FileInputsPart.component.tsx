/* eslint-disable complexity */
import './MainBlockAdmin.style.scss';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InboxOutlined } from '@ant-design/icons';
import CreateUpdateMediaStore from '@app/stores/create-update-media-store';
import useMobx from '@app/stores/root-store';
import combinedImageValidator from '@components/modals/validators/combinedImageValidator';
import { ModelState } from '@models/enums/model-state';
import Image, { ImageAssigment, ImageCreateUpdate } from '@models/media/image.model';

import { FormInstance, Modal, UploadFile } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import AudiosApi from '@/app/api/media/audios.api';
import ImagesApi from '@/app/api/media/images.api';
import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Audio, { AudioUpdate } from '@/models/media/audio.model';

import PreviewFileModal from './PreviewFileModal/PreviewFileModal.component';
import VALIDATION_MESSAGES from '@/app/common/constants/validation-messages.constants';
import REQUIRED_FIELD_MESSAGES from '@/app/common/constants/required_field_messages.constrants';

const convertFileToUploadFile = (file: Image | Audio) => {
    const newFileList: UploadFile = {
        uid: `${file.id}`,
        name: 'alt' in file ? file.alt ?? '' : 'description' in file ? file.description ?? '' : '',
        status: 'done',
        thumbUrl: base64ToUrl(file.base64, file.mimeType) ?? '',
        type: file.mimeType,
    };
    return newFileList;
};

interface FileInputsPartProps {
    form: FormInstance<unknown>; // Explicitly define the type for the 'form' prop
    onChange: (propertyName: string, value: any) => void;
}

const FileInputsPart = ({ form, onChange }: FileInputsPartProps) => {
    const { createUpdateMediaStore } = useMobx();

    const [audio, setAudio] = useState<UploadFile[]>([]);
    const [animation, setAnimation] = useState<UploadFile[]>([]);
    const [blackAndWhite, setBlackAndWhite] = useState<UploadFile[]>([]);
    const [relatedFigure, setRelatedFigure] = useState<UploadFile[]>([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);

    const [visibleModal, setVisibleModal] = useState(false);
    const [fileHandle, setFileHandler] = useState<any>();
    const [idHandle, setIdHandler] = useState<any>();
    const [visibleErrorRelatedFigure, setVisibleErrorRelatedFigure] = useState<boolean>(false);
    const [visibleErrorAudio, setVisibleErrorAudio] = useState<boolean>(false);

    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
    };

    const { id } = useParams<any>();
    const parseId = id ? +id : null;

    const handleRemove = useCallback(() => {
        setVisibleModal(true);
    }, []);

    const fileHandler = (file: UploadFile, id_: string) => {
        setFileHandler(file);
        setIdHandler(id_);
        handleRemove();
    };

    const handleCancelModalRemove = useCallback(() => {
        setVisibleModal(false);
    }, []);

    const handleFileRemove = <K extends keyof CreateUpdateMediaStore, V extends CreateUpdateMediaStore[K]>
        (propertyName: K, arrayName: keyof CreateUpdateMediaStore) => {
        const array = createUpdateMediaStore[arrayName] as (ImageCreateUpdate | AudioUpdate)[];
        const item = array.find((x) => x.id === createUpdateMediaStore[propertyName]);
        if (item) {
            item.modelState = ModelState.Deleted;
            createUpdateMediaStore[propertyName] = null as V;
        }
        onChange(propertyName, null);
    };
    
    const typeDef = () => {
        switch (idHandle) {
        case 'webp':
        case 'gif': {
            handleFileRemove('animationId', 'imagesUpdate');
            setAnimation((prev) => prev.filter((x) => x.uid !== fileHandle.uid));
            handleCancelModalRemove();
            form.setFieldsValue({ animations: [] });
            break;
        }
        case 'blackAndWhite': {
            handleFileRemove('blackAndWhiteId', 'imagesUpdate');
            setBlackAndWhite((prev) => prev.filter((x) => x.uid !== fileHandle.uid));
            handleCancelModalRemove();
            form.setFieldsValue({ pictureBlackWhite: undefined });
            form.validateFields(['pictureBlackWhite']).catch(() => {});
            break;
        }
        case 'relatedFigure': {
            handleFileRemove('relatedFigureId', 'imagesUpdate');
            setRelatedFigure((prev) => prev.filter((x) => x.uid !== fileHandle.uid));
            handleCancelModalRemove();
            form.setFieldsValue({ pictureRelations: [] });
            break;
        }
        case 'audio': {
            handleFileRemove('audioId', 'audioUpdate');
            setAudio((prev) => prev.filter((x) => x.uid !== fileHandle.uid));
            handleCancelModalRemove();
            break;
        }
        default: break;
        }
    };

    const handleFileUpload = <K extends keyof CreateUpdateMediaStore, V extends CreateUpdateMediaStore[K]>(
        fileId: number,
        propertyName: K,
        arrayName: keyof CreateUpdateMediaStore,
    ) => {
        const array = createUpdateMediaStore[arrayName] as (ImageCreateUpdate | AudioUpdate)[];
        if (createUpdateMediaStore[propertyName]) {
            const item = array.find((x) => x.id === createUpdateMediaStore[propertyName]);
            if (item) {
                item.modelState = ModelState.Deleted;
            }
        }

        createUpdateMediaStore[propertyName] = fileId as V;
        array.push({ id: fileId, streetcodeId: parseId, modelState: ModelState.Created });

        onChange(propertyName, fileId);
    };

    useEffect(() => {
        if (parseId) {
            const fetchData = async () => {
                try {
                    await ImagesApi.getByStreetcodeId(parseId).then((result) => {
                        result.forEach((image) => {
                            if (image.imageDetails?.alt === ImageAssigment.animation.toString()) {
                                setAnimation([convertFileToUploadFile(image)]);
                                form.setFieldsValue({ animations: [convertFileToUploadFile(image)] });
                                createUpdateMediaStore.animationId = image.id;
                            }

                            if (image.imageDetails?.alt === ImageAssigment.blackandwhite.toString()) {
                                setBlackAndWhite([convertFileToUploadFile(image)]);
                                form.setFieldsValue({ pictureBlackWhite: [convertFileToUploadFile(image)] });
                                createUpdateMediaStore.blackAndWhiteId = image.id;
                            }

                            if (image.imageDetails?.alt === ImageAssigment.relatedfigure.toString()) {
                                setRelatedFigure([convertFileToUploadFile(image)]);
                                form.setFieldsValue({ pictureRelations: [convertFileToUploadFile(image)] });
                                createUpdateMediaStore.relatedFigureId = image.id;
                            }
                        });

                        createUpdateMediaStore.imagesUpdate = result.map((img) => ({
                            ...img,
                            streetcodeId: parseId,
                            modelState: ModelState.Updated,
                        }));
                    });
                    await AudiosApi.getByStreetcodeId(parseId).then((result) => {
                        setAudio(result ? [convertFileToUploadFile(result)] : []);
                        form.setFieldsValue({
                            audio: result ? [convertFileToUploadFile(result)] : [],
                        });
                        createUpdateMediaStore.audioId = result?.id;
                        if (result) {
                            const audioUpdate : AudioUpdate = {
                                id: result.id,
                                streetcodeId: parseId,
                                modelState: ModelState.Updated,
                            };
                            createUpdateMediaStore.audioUpdate = [audioUpdate];
                        } else {
                            createUpdateMediaStore.audioUpdate = [];
                        }
                    });
                } catch (error) { /* empty */ } finally { /* empty */ }
            };
            fetchData();
        }
    }, []);

    const checkFile = async (file: UploadFile, isRequired: boolean): Promise<string> => {
        const validator = combinedImageValidator(isRequired);
        return validator({}, file)
            .then(() => '')
            .catch((error) => error.message);
    };

    const onImageChange = async (file: UploadFile, fieldName: string) => {
        const fileCheck = await checkFile(file, false);
        if (fileCheck) {
            form.setFieldsValue({ [fieldName]: [] });
            form.setFields([
                {
                    name: fieldName,
                    errors: [fileCheck],
                },
            ]);
        }
    };

    return (
        <div>
            <div className="photo-uploader-container scrollable-container">
                <p className="photo-uploader-title">
                    Зображення
                </p>
                <div className="photo-uploader-items-container">
                    <FormItem
                        name="animations"
                        label="Кольорове"
                        rules={[
                            { validator: combinedImageValidator(false) },
                        ]}
                    >
                        <FileUploader
                            accept=".jpeg,.png,.jpg,.webp"
                            listType="picture-card"
                            multiple={false}
                            maxCount={1}
                            fileList={animation}
                            beforeUpload={async (file) => !(await checkFile(file, false))}
                            onPreview={handlePreview}
                            uploadTo="image"
                            imageType={ImageAssigment.animation}
                            onSuccessUpload={(file: Image | Audio) => {
                                handleFileUpload(file.id, 'animationId', 'imagesUpdate');
                                setAnimation([convertFileToUploadFile(file as Image)]);
                            }}
                            onChange={(info) => onImageChange(info.file, 'animations')}
                            onRemove={(file) => {
                                fileHandler(file, 'gif');
                            }}
                        >
                            <InboxOutlined />
                            <p className="ant-upload-text">{animation.length === 1 ? 'Змінити' : '+ Додати'}</p>
                        </FileUploader>
                    </FormItem>

                <FormItem
                    name="pictureBlackWhite"
                    label="Чорнобіле"
                    rules={[
                        {
                            required: true,
                            message: REQUIRED_FIELD_MESSAGES.ADD_IMAGE,
                        },
                        { validator: combinedImageValidator(true) },
                    ]}
                 >
                        <FileUploader
                            multiple={false}
                            accept=".jpeg,.png,.jpg,.webp"
                            listType="picture-card"
                            maxCount={1}
                            fileList={blackAndWhite}
                            beforeUpload={async (file) => !(await checkFile(file, true))}
                            onPreview={handlePreview}
                            uploadTo="image"
                            imageType={ImageAssigment.blackandwhite}
                            onSuccessUpload={(file: Image | Audio) => {
                                handleFileUpload(file.id, 'blackAndWhiteId', 'imagesUpdate');
                                setBlackAndWhite([convertFileToUploadFile(file as Image)]);
                            }}
                            onRemove={(file) => {
                                fileHandler(file, 'blackAndWhite');
                            }}
                        >
                            <InboxOutlined />
                            <p className="ant-upload-text">{blackAndWhite.length === 1 ? 'Змінити' : '+ Додати'}</p>
                        </FileUploader>
                    </FormItem>

                    <FormItem
                        name="pictureRelations"
                        label="Для зв'язків"
                        rules={[
                            { validator: combinedImageValidator(false) },
                        ]}
                    >
                        <FileUploader
                            multiple={false}
                            accept=".jpeg,.png,.jpg,.webp"
                            listType="picture-card"
                            maxCount={1}
                            fileList={relatedFigure}
                            onPreview={handlePreview}
                            uploadTo="image"
                            imageType={ImageAssigment.relatedfigure}
                            beforeUpload={async (file) => !(await checkFile(file, false))}
                            onSuccessUpload={(file: Image | Audio) => {
                                handleFileUpload(file.id, 'relatedFigureId', 'imagesUpdate');
                                setRelatedFigure([convertFileToUploadFile(file as Image)]);
                            }}
                            onChange={(info) => onImageChange(info.file, 'pictureRelations')}
                            onRemove={(file) => {
                                fileHandler(file, 'relatedFigure');
                            }}
                        >
                            <InboxOutlined />
                            <p className="ant-upload-text">{relatedFigure.length === 1 ? 'Змінити' : '+ Додати'}</p>
                        </FileUploader>
                        {visibleErrorRelatedFigure && (
                            <p className="error-text">
                                {VALIDATION_MESSAGES.INVALID_IMAGE_FORMAT}
                            </p>
                        )}
                    </FormItem>
                </div>
            </div>
            <div className="display-flex-row">
                <FormItem
                    name="audio"
                    label="Аудіо"
                    rules={[
                        {
                            validator: (_, file) => {
                                if (file) {
                                    let name = '';
                                    if (file.file) {
                                        name = file.file.name.toLowerCase();
                                    } else if (file.name) {
                                        name = file.name.toLowerCase();
                                    }
                                    if (name.endsWith('.mp3') || name === '') {
                                        setVisibleErrorAudio(false);
                                        return Promise.resolve();
                                    }
                                    setVisibleErrorAudio(true);
                                    return Promise.resolve();
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <FileUploader
                        className="audioUploader"
                        multiple={false}
                        accept=".mp3"
                        maxCount={1}
                        listType="picture-card"
                        fileList={audio}
                        uploadTo="audio"
                        onSuccessUpload={(file: Audio) => {
                            handleFileUpload(file.id, 'audioId', 'audioUpdate');
                            setAudio([convertFileToUploadFile(file)]);
                        }}
                        beforeUpload={(file) => {
                            const isValid = (file.type === 'audio/mpeg');
                            if (!isValid) {
                                return Promise.reject();
                            }
                            return Promise.resolve();
                        }}
                        onRemove={(file) => {
                            fileHandler(file, 'audio');
                        }}
                    >
                        <InboxOutlined />
                        <p className="ant-upload-text">{audio.length === 1 ? 'Змінити' : '+ Додати'}</p>
                    </FileUploader>
                    {visibleErrorAudio && (
                        <p className="error-text">
                            {VALIDATION_MESSAGES.INVALID_AUDIO_FORMAT}
                        </p>
                    )}
                </FormItem>

                <Modal
                    title="Ви впевнені, що хочете видалити даний елемент?"
                    open={visibleModal}
                    onOk={(e) => {
                        typeDef();
                    }}
                    onCancel={handleCancelModalRemove}
                />
            </div>
            <PreviewFileModal file={filePreview} opened={previewOpen} setOpened={setPreviewOpen} />
        </div>
    );
};
export default FileInputsPart;
