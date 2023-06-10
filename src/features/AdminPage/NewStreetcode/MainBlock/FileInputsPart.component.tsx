/* eslint-disable complexity */
import './MainBlockAdmin.style.scss';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InboxOutlined } from '@ant-design/icons';
import useMobx from '@app/stores/root-store';
import Image from '@models/media/image.model';

import { UploadFile } from 'antd';
import FormItem from 'antd/es/form/FormItem';

import AudiosApi from '@/app/api/media/audios.api';
import ImagesApi from '@/app/api/media/images.api';
import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Audio from '@/models/media/audio.model';

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

const FileInputsPart = () => {
    const { newStreetcodeInfoStore } = useMobx();

    const [images, setImages] = useState<Image[]>([]);
    const [audio, setAudio] = useState<UploadFile[]>([]);
    const [animation, setAnimation] = useState<UploadFile[]>([]);
    const [blackAndWhite, setBlackAndWhite] = useState<UploadFile[]>([]);
    const [relatedFigure, setRelatedFigure] = useState<UploadFile[]>([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);

    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
    };

    const { id } = useParams<any>();
    const parseId = id ? +id : null;

    useEffect(() => {
        if (parseId) {
            const fetchData = async () => {
                try {
                    await ImagesApi.getByStreetcodeId(parseId).then((result) => {
                        setImages(result);
                        setAnimation([convertFileToUploadFile(result[0])]);
                        setBlackAndWhite([convertFileToUploadFile(result[1])]);
                        setRelatedFigure([convertFileToUploadFile(result[2])]);
                    });
                    await AudiosApi.getByStreetcodeId(parseId).then((result) => {
                        setAudio([convertFileToUploadFile(result)]);
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
                    rules={[{ required: !(parseId && images.length > 1),
                              message: parseId ? 'Змінити анімацію' : 'Завантажте анімацію' }]}
                >
                    <FileUploader
                        accept=".gif"
                        listType="picture-card"
                        multiple={false}
                        maxCount={1}
                        fileList={animation}
                        onPreview={handlePreview}
                        uploadTo="image"
                        onSuccessUpload={(file: Image) => {
                            newStreetcodeInfoStore.AnimationId = file.id;
                            setAnimation([convertFileToUploadFile(file)]);
                        }}
                        onRemove={(file) => {
                            setAnimation((prev) => prev.filter((x) => x.uid !== file.uid));
                            // ImagesApi.delete(newStreetcodeInfoStore.animationId!);
                        }}
                    >
                        <InboxOutlined />
                        <p className="ant-upload-text">{parseId && images.length > 0 ? 'Змінити' : '+ Додати'}</p>
                    </FileUploader>
                </FormItem>

                <FormItem
                    name="pictureBlackWhite"
                    label="Чорнобіле"
                    rules={[{ required: !(parseId && images.length > 1),
                              message: parseId ? 'Змінити анімацію' : 'Завантажте анімацію' }]}
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
                            newStreetcodeInfoStore.BlackAndWhiteId = file.id;
                            setBlackAndWhite([convertFileToUploadFile(file)]);
                        }}
                        onRemove={(file) => {
                            setBlackAndWhite((prev) => prev.filter((x) => x.uid !== file.uid));
                            // ImagesApi.delete(newStreetcodeInfoStore.blackAndWhiteId!);
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
                            newStreetcodeInfoStore.relatedFigureId = file.id;
                            setBlackAndWhite([convertFileToUploadFile(file)]);
                        }}
                        onRemove={(file) => {
                            setRelatedFigure((prev) => prev.filter((x) => x.uid !== file.uid));
                            // ImagesApi.delete(newStreetcodeInfoStore.relatedFigureId!);
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
                        uploadTo="audio"
                        onSuccessUpload={(file: Audio) => {
                            newStreetcodeInfoStore.audioId = file.id;
                            setAudio([convertFileToUploadFile(file)]);
                        }}
                        onRemove={(file) => {
                            AudiosApi.delete(newStreetcodeInfoStore.audioId!);
                        }}
                    >
                        <InboxOutlined />
                        <p className="ant-upload-text">{parseId && audio.length > 0 ? 'Змінити' : '+ Додати'}</p>
                    </FileUploader>
                </FormItem>
            </div>
            <PreviewFileModal file={filePreview} opened={previewOpen} setOpened={setPreviewOpen} />
        </div>
    );
};
export default FileInputsPart;
