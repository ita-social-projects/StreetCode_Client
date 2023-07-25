/* eslint-disable complexity */
import './MainBlockAdmin.style.scss';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InboxOutlined } from '@ant-design/icons';
import CreateUpdateMediaStore from '@app/stores/create-update-media-store';
import useMobx from '@app/stores/root-store';
import { ModelState } from '@models/enums/model-state';
import Image, { ImageUpdate } from '@models/media/image.model';

import { UploadFile } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import AudiosApi from '@/app/api/media/audios.api';
import ImagesApi from '@/app/api/media/images.api';
import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Audio, { AudioUpdate } from '@/models/media/audio.model';

import PreviewFileModal from './PreviewFileModal/PreviewFileModal.component';

import { Modal } from 'antd';
import { useCallback, useState } from 'react'

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

const FileInputsPart = ({ onChange }) => {
    const { createUpdateMediaStore } = useMobx();

    const [images, setImages] = useState<Image[]>([]);
    const [audio, setAudio] = useState<UploadFile[]>([]);
    const [animation, setAnimation] = useState<UploadFile[]>([]);
    const [fileValidationError, setFileValidationError] = useState<string | null>(null);
    const [blackAndWhite, setBlackAndWhite] = useState<UploadFile[]>([]);
    const [relatedFigure, setRelatedFigure] = useState<UploadFile[]>([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);

    const [visibleModal, setVisibleModal] = useState(false);
    const [fileHandle, setFileHandler] = useState<any>();
    const [idHandle, setIdHandler] = useState<any>();

    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
    };

    const { id } = useParams<any>();
    const parseId = id ? +id : null;

    const fileHandler = (file: UploadFile, id: string) => {
        setFileHandler(file);
        setIdHandler(id);
        handleRemove();
    };
    const handleRemove = useCallback(() => {
        setVisibleModal(true);
    }, []);

    const handleCancelModalRemove = useCallback(() => {
        setVisibleModal(false);
    }, []);

    const typeDef = () => {
        switch (idHandle) {
            case 'gif': {
                handleFileRemove('animationId', 'imagesUpdate');
                setAnimation((prev) => prev.filter((x) => x.uid !== fileHandle.uid));
                handleCancelModalRemove();
                break;
            }
            case 'blackAndWhite': {
                handleFileRemove('blackAndWhiteId', 'imagesUpdate');
                setBlackAndWhite((prev) => prev.filter((x) => x.uid !== fileHandle.uid));
                handleCancelModalRemove();
                break;
            }
            case 'relatedFigure': {
                handleFileRemove('relatedFigureId', 'imagesUpdate');
                setRelatedFigure((prev) => prev.filter((x) => x.uid !== fileHandle.uid));
                handleCancelModalRemove();
                break;
            }
            case 'audio': {
                handleFileRemove('audioId', 'audioUpdate');
                setAudio((prev) => prev.filter((x) => x.uid !== fileHandle.uid));
                handleCancelModalRemove();
                break;
            }
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

    useEffect(() => {
        if (parseId) {
            const fetchData = async () => {
                try {
                    await ImagesApi.getByStreetcodeId(parseId).then((result) => {
                        setImages(result);
                        setAnimation([convertFileToUploadFile(result[0])]);
                        setBlackAndWhite([convertFileToUploadFile(result[1])]);
                        setRelatedFigure(result[2] ? [convertFileToUploadFile(result[2])] : []);

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
            <div className="photo-uploader-container">
                <FormItem
                    name="animations"
                    label="Анімація"
                    rules={[{
                        required: !(parseId && images.length > 1),
                        message: parseId ? 'Змінити анімацію' : 'Завантажте анімацію'
                    }]}
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
                                setFileValidationError('Тільки файли .gif дозволені!');
                            }
                            return isGif;
                        }}
                        onPreview={handlePreview}
                        uploadTo="image"
                        onSuccessUpload={(file: Image) => {
                            handleFileUpload(file.id, 'animationId', 'imagesUpdate');
                            setAnimation([convertFileToUploadFile(file)]);
                            setFileValidationError(null)
                        }}
                        onRemove={(file) => {
                            fileHandler(file, "gif")
                        }}
                    >
                        <InboxOutlined />
                        <p className="ant-upload-text">{parseId && images.length > 0 ? 'Змінити' : '+ Додати'}</p>
                    </FileUploader>
                    {fileValidationError && <div style={{ color: 'red' }}>{fileValidationError}</div>}
                </FormItem>
                
                <FormItem
                    name="pictureBlackWhite"
                    label="Чорнобіле"
                    rules={[{
                        required: !(parseId && images.length > 1),
                        message: parseId ? 'Змінити' : '+ Додати'
                    }]}
                >
                    <FileUploader
                        multiple={false}
                        accept=".jpeg,.png,.jpg"
                        listType="picture-card"
                        maxCount={1}
                        fileList={blackAndWhite}
                        onPreview={handlePreview}
                        uploadTo="image"
                        onSuccessUpload={(file: Image) => {
                            handleFileUpload(file.id, 'blackAndWhiteId', 'imagesUpdate');
                            setBlackAndWhite([convertFileToUploadFile(file)]);
                        }}
                        onRemove={(file) => {
                            fileHandler(file, "blackAndWhite")
                        }}
                    >
                        <InboxOutlined />
                        <p className="ant-upload-text">{parseId && images.length > 1 ? 'Змінити' : '+ Додати'}</p>
                    </FileUploader>
                </FormItem>

                <FormItem
                    name="pictureRelations"
                    label="Для зв'язків"
                >
                    <FileUploader
                        multiple={false}
                        accept=".jpeg,.png,.jpg"
                        listType="picture-card"
                        maxCount={1}
                        {...(relatedFigure[0] ? { fileList: relatedFigure } : null)}
                        onPreview={handlePreview}
                        uploadTo="image"
                        onSuccessUpload={(file: Image) => {
                            handleFileUpload(file.id, 'relatedFigureId', 'imagesUpdate');
                            setRelatedFigure([convertFileToUploadFile(file)]);
                        }}
                        onRemove={(file) => {
                            fileHandler(file, "relatedFigure");
                        }}
                    >
                        <InboxOutlined />
                        <p className="ant-upload-text">{parseId && images.length > 2 ? 'Змінити' : '+ Додати'}</p>
                    </FileUploader>
                </FormItem>
            </div>
            <div className="display-flex-row">
                <FormItem
                    name="audio"
                    label="Аудіо"
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
                        onRemove={(file) => {
                            fileHandler(file, "audio")
                        }}
                    >
                        <InboxOutlined />
                        <p className="ant-upload-text">{parseId && audio.length > 0 ? 'Змінити' : '+ Додати'}</p>
                    </FileUploader>
                </FormItem>
                <Modal
                    title={`Ви впевнені, що хочете видалити даний елемент?`}
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
