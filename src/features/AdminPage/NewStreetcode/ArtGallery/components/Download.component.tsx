import React, { useEffect, useRef, useState } from 'react';

import { Upload } from 'antd';
import type { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload/interface';

import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import { ArtCreate } from '@/models/media/art.model';
import Image from '@/models/media/image.model';

import ArtGalleryAdminBlock from './ArtGallery/ArtGalleryAdminBlock.component';
import PreviewImageModal from './PreviewImageModal/PreviewImageModal.component';

const DownloadBlock: React.FC = () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const uidsFiles = useRef<string[]>([]);
    const [arts, setArts] = useState<ArtCreate[]>([]);
    const indexTmp = 0;

    useEffect(() => {
        uidsFiles.current = fileList.map((f) => f.uid);
    }, [arts]);

    /*    const onChange = (uploadParams:UploadChangeParam<UploadFile<any>>) => {
        if (uploadParams.fileList.length > 0) {
            setFileList(uploadParams.fileList.map((x) => x));
            const deletedFiles = fileList?.filter((file) => !uploadParams.fileList.includes(file));
            if (deletedFiles.length > 0) {
                const updatedArts = arts.filter((art) => !deletedFiles.find((x) => x.uid === art.uid));
                setArts([...updatedArts]);
            } else {
                uploadParams.fileList.forEach(async (x) => {
                    let src = x.thumbUrl as string;
                    if (!src) {
                        src = await new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.readAsDataURL(x.originFileObj as RcFile);
                            reader.onload = () => resolve(reader.result as string);
                        });
                    }

                    const art: ArtCreate = {
                        index: indexTmp + 1,
                        description: 'description',
                        image: src,
                        title: 'title',
                        ima: x.uid,
                    };
                    setArts([...arts, art]);
                });
            }
        } else {
            setArts([]);
            setFileList(newFileList.map((x) => x));
        }
    };
 */
    const onChange = (uploadParams:UploadChangeParam<UploadFile<any>>) => {
        if (uploadParams.file.status === 'removed') {
            const del = uploadParams.fileList.indexOf(uploadParams.file);
            console.log(del);
        }
        setFileList(uploadParams.fileList.map((x) => x));
    };

    const onPreview = async (file: UploadFile) => {
        setFilePreview(file);
        setIsOpen(true);
    };
    const onSuccessUpload = (image:Image) => {
        const newArt: ArtCreate = {
            index: indexTmp + 1,
            description: 'description',
            image: image.base64,
            title: 'title',
            imageId: image.id,
            mimeType: image.mimeType,
        };
        setArts([...arts, newArt]);
    };
    const onRemoveFile = (file:UploadFile) => {
        const deletedIndex = uidsFiles.current.indexOf(file.uid);
        if (deletedIndex >= 0) {
            arts.splice(deletedIndex, 1);
            uidsFiles.current.splice(deletedIndex, 1);
            setArts([...arts]);

        }
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
                multiple
                onRemove={onRemoveFile}
            >
                {fileList.length < 15 ? <p>+ Додати</p> : <></>}
            </FileUploader>
            <h4>Прев'ю</h4>
            <ArtGalleryAdminBlock art={arts} />
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
