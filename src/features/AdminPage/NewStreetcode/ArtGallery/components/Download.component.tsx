import { Upload } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import React, { useEffect, useState } from 'react';
import PreviewImageModal from './PreviewImageModal/PreviewImageModal.component';
import ArtGalleryAdminBlock from './ArtGallery/ArtGalleryAdminBlock.component';

interface Art {
    description: string;
    image: string;
    index: number;
    title: string;
    uid: any;
}

const DownloadBlock: React.FC = () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState<string | null>(null);
    const [desc, setDesc] = useState<string | null>(null);
    
    const [arts, setArts] = useState<Art[]>([]);
    let indexTmp = 0;

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        if (newFileList.length > 0) {
            setFileList(newFileList.map(x => x));
            const deletedFiles = fileList?.filter(file => !newFileList.includes(file));
            if (deletedFiles.length > 0) {

                const updatedArts = arts.filter(art => !deletedFiles.find(x => x.uid === art.uid));
                setArts([...updatedArts]);
            }
            else {
                newFileList.forEach(async x => {
                    let src = x.thumbUrl as string;
                    if (!src) {
                        src = await new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.readAsDataURL(x.originFileObj as RcFile);
                            reader.onload = () => resolve(reader.result as string);
                        });
                    }

                    let art: Art = {
                        index: indexTmp + 1,
                        description: "",
                        image: src,
                        title: x.fileName ? x.fileName : x.name,
                        uid: x.uid
                    }
                    setArts([...arts, art]);
                });
            }
        }
        else {
            setArts([]);
            setFileList(newFileList.map(x => x));

        }
    };

    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as RcFile);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        setTitle(arts.find(x => x.uid === file.uid)?.title);
        setDesc(arts.find(x => x.uid === file.uid)?.description);
        setFilePreview(file);
        setIsOpen(true);

    };

    const handleSave = (newTitle: string, newDesc: string) => {
        const updatedFileList = fileList.map(file => {
            if (file.uid === filePreview?.uid) {
                arts.find(x => x.uid === file.uid)?.description = newDesc;
                arts.find(x => x.uid === file.uid)?.title = newTitle;
            }
            return file;
        });
        setArts([...arts]);
        setFileList([...updatedFileList]);
        
        setIsOpen(false);
    };

    return (
        <>
            <Upload
                accept=".jpeg,.png,.jpg"
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
                onSave={handleSave}
            >
                {fileList.length < 15 && '+ Додати'}
            </Upload>
            <ArtGalleryAdminBlock art={arts} />
            <h4>Прев'ю</h4>
            <PreviewImageModal file={filePreview} title={title} desc={desc} onSave={handleSave} opened={isOpen} setOpened={setIsOpen} />

        </>
    );
};

export default DownloadBlock;