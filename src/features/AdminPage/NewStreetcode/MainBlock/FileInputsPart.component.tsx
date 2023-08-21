/* eslint-disable complexity */
import './MainBlockAdmin.style.scss';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InboxOutlined } from '@ant-design/icons';
import CreateUpdateMediaStore from '@app/stores/create-update-media-store';
import useMobx from '@app/stores/root-store';
import { ModelState } from '@models/enums/model-state';
import Image, { ImageUpdate } from '@models/media/image.model';
import { parse } from 'path';

import { FormInstance, Modal, UploadFile } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import AudiosApi from '@/app/api/media/audios.api';
import ImagesApi from '@/app/api/media/images.api';
import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Audio, { AudioUpdate } from '@/models/media/audio.model';

import PreviewFileModal from './PreviewFileModal/PreviewFileModal.component';

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
        const array = createUpdateMediaStore[arrayName] as (ImageUpdate | AudioUpdate)[];
        const item = array.find((x) => x.id === createUpdateMediaStore[propertyName]);
        if (item) {
            item.modelState = ModelState.Deleted;
            createUpdateMediaStore[propertyName] = null as V;
        }
        onChange(propertyName, null);
    };

    const typeDef = () => {
        switch (idHandle) {
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
            form.setFieldsValue({ pictureBlackWhite: [] });
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
        const array = createUpdateMediaStore[arrayName] as (ImageUpdate | AudioUpdate)[];
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
                        setAnimation([convertFileToUploadFile(result[0])]);
                        setBlackAndWhite([convertFileToUploadFile(result[1])]);
                        setRelatedFigure(result[2] ? [convertFileToUploadFile(result[2])] : []);
                        form.setFieldsValue({
                            animations: [convertFileToUploadFile(result[0])],
                            pictureBlackWhite: [convertFileToUploadFile(result[1])],
                            pictureRelations: result[2] ? [convertFileToUploadFile(result[2])] : [],
                        });

                        createUpdateMediaStore.animationId = result[0].id;
                        createUpdateMediaStore.blackAndWhiteId = result[1].id;
                        createUpdateMediaStore.relatedFigureId = result[2]?.id;

                        createUpdateMediaStore.imagesUpdate = result.map((img) => ({
                            ...img,
                            streetcodeId: parseId,
                            modelState: ModelState.Updated,
                        }));
                    });
                    await AudiosApi.getByStreetcodeId(parseId).then((result) => {
                        setAudio(result ? [convertFileToUploadFile(result)] : []);
                        createUpdateMediaStore.audioId = result?.id;
                    });
                } catch (error) { /* empty */ } finally { /* empty */ }
            };
            fetchData();
        }
    }, []);

    return (
        <div>
            <div className="photo-uploader-container scrollable-container">
                <FormItem
                    name="animations"
                    label="Анімація"
                    rules={[
                        {
                            required: true,
                            message: 'Завантажте анімацію',
                        },
                        {
                            validator: (_, file) => {
                                if (file) {
                                    let name = '';
                                    if (file.file) {
                                        name = file.file.name.toLowerCase();
                                    } else if (file.name) {
                                        name = file.name.toLowerCase();
                                    }
                                    if (name.endsWith('.gif') || name === '') {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(Error('Тільки файли з розширенням .gif дозволені!'));
                                }
                                return Promise.reject();
                            },
                        },
                    ]}
                >
                    <FileUploader
                        accept=".gif"
                        listType="picture-card"
                        multiple={false}
                        maxCount={1}
                        fileList={animation}
                        beforeUpload={(file) => {
                            const isGif = file.type === 'image/gif';
                            if (!isGif) {
                                return Promise.reject();
                            }
                            return Promise.resolve();
                        }}
                        onPreview={handlePreview}
                        uploadTo="image"
                        onSuccessUpload={(file: Image | Audio) => {
                            handleFileUpload(file.id, 'animationId', 'imagesUpdate');
                            setAnimation([convertFileToUploadFile(file as Image)]);
                        }}
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
                    rules={[{
                        required: true,
                        message: 'Додайте зображення',
                    },
                    {
                        validator: (_, file) => {
                            if (file) {
                                let name = '';
                                if (file.file) {
                                    name = file.file.name.toLowerCase();
                                } else if (file.name) {
                                    name = file.name.toLowerCase();
                                }
                                if (name.endsWith('.jpeg') || name.endsWith('.png')
                                || name.endsWith('.jpg') || name === '') {
                                    return Promise.resolve();
                                }

                                return Promise.reject(Error('Тільки файли з розширенням jpeg, png, jpg дозволені!'));
                            }
                            return Promise.reject();
                        },
                    },
                    ]}
                >
                    <FileUploader
                        multiple={false}
                        accept=".jpeg,.png,.jpg"
                        listType="picture-card"
                        maxCount={1}
                        fileList={blackAndWhite}
                        onPreview={handlePreview}
                        uploadTo="image"
                        beforeUpload={(file) => {
                            const isValid = (file.type === 'image/jpeg')
                            || (file.type === 'image/png') || (file.type === 'image/jpg');
                            if (!isValid) {
                                return Promise.reject();
                            }
                            return Promise.resolve();
                        }}
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
                        {
                            validator: (_, file) => {
                                if (file) {
                                    let name = '';
                                    if (file.file) {
                                        name = file.file.name.toLowerCase();
                                    } else if (file.name) {
                                        name = file.name.toLowerCase();
                                    }
                                    if (name.endsWith('.jpeg') || name.endsWith('.png')
                                    || name.endsWith('.jpg') || name === '') {
                                        setVisibleErrorRelatedFigure(false);
                                        return Promise.resolve();
                                    }
                                    setVisibleErrorRelatedFigure(true);
                                    return Promise.resolve();
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <FileUploader
                        multiple={false}
                        accept=".jpeg,.png,.jpg"
                        listType="picture-card"
                        maxCount={1}
                        fileList={relatedFigure}
                        onPreview={handlePreview}
                        uploadTo="image"
                        beforeUpload={(file) => {
                            const isValid = (file.type === 'image/jpeg')
                            || (file.type === 'image/png') || (file.type === 'image/jpg');
                            if (!isValid) {
                                return Promise.reject();
                            }
                            return Promise.resolve();
                        }}
                        onSuccessUpload={(file: Image | Audio) => {
                            handleFileUpload(file.id, 'relatedFigureId', 'imagesUpdate');
                            setRelatedFigure([convertFileToUploadFile(file as Image)]);
                        }}
                        onRemove={(file) => {
                            fileHandler(file, 'relatedFigure');
                        }}
                    >
                        <InboxOutlined />
                        <p className="ant-upload-text">{relatedFigure.length === 1 ? 'Змінити' : '+ Додати'}</p>
                    </FileUploader>
                    {visibleErrorRelatedFigure && (
                        <p className="error-text">
                Тільки файли з розширенням jpeg, png, jpg дозволені!
                        </p>
                    )}
                </FormItem>
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
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(Error('Тільки файли з розширенням .mp3 дозволені!'));
                                }
                                return Promise.reject();
                            },
                        },
                    ]}
                >
                    <FileUploader
                        accept=".mp3"
                        maxCount={1}
                        listType="picture-card"
                        {...(audio ? { fileList: audio } : null)}
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
