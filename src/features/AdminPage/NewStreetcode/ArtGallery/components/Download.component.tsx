import React, { useRef, useState } from 'react';

import type { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';

import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import { ArtCreate } from '@/models/media/art.model';
import Image from '@/models/media/image.model';

import ArtGalleryAdminBlock from './ArtGallery/ArtGalleryAdminBlock.component';
import PreviewImageModal from './PreviewImageModal/PreviewImageModal.component';

const DownloadBlock: React.FC<{ arts:ArtCreate[],
    setArts: React.Dispatch<React.SetStateAction<ArtCreate[]>> }> = ({ arts, setArts }) => {
        const [fileList, setFileList] = useState<UploadFile[]>([]);
        const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
        const [isOpen, setIsOpen] = useState(false);
        const uidsFile = useRef<string>('');
        const indexTmp = useRef<number>(0);

        const onChange = (uploadParams:UploadChangeParam<UploadFile<any>>) => {
            uidsFile.current = uploadParams.file.uid;
            setFileList(uploadParams.fileList.map((x) => x));
        };

        const onPreview = async (file: UploadFile) => {
            setFilePreview(file);
            setIsOpen(true);
        };
        const onSuccessUpload = (image:Image) => {
            const newArt: ArtCreate = {
                index: indexTmp.current + 1,
                description: 'description',
                image: image.base64,
                title: 'title',
                imageId: image.id,
                mimeType: image.mimeType,
                uidFile: uidsFile.current,
            };
            indexTmp.current += 1;
            setArts([...arts, newArt]);
        };
        const onRemoveFile = (file:UploadFile) => {
            setArts(arts.filter((a) => a.uidFile !== file.uid) ?? []);
        };

        const handleSave = (art: ArtCreate) => {
            const updated = arts.find((x) => x.imageId === art.imageId);
            if (!updated) {
                return;
            }
            updated.description = art.description;
            updated.title = art.title;
            setArts([...arts]);
            setIsOpen(false);
        };

        return (
            <>
                <FileUploader
                    accept=".jpeg,.png,.jpg"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={onPreview}
                    uploadTo="image"
                    onChange={onChange}
                    onSuccessUpload={onSuccessUpload}
                    onRemove={onRemoveFile}
                >
                    {fileList.length < 15 ? <p>+ Додати</p> : <></>}
                </FileUploader>
                <h4>Попередній перегляд</h4>
                <ArtGalleryAdminBlock arts={arts} />
                <PreviewImageModal
                    art={arts[fileList.indexOf(filePreview!)]}
                    onSave={handleSave}
                    opened={isOpen}
                    setOpened={setIsOpen}
                />
            </>
        );
    };

export default DownloadBlock;