import './DownloadStyles.styles.scss';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import base64ToUrl from '@app/common/utils/base64ToUrl.utility';
import useMobx from '@app/stores/root-store';
import { ModelState } from '@models/enums/model-state';

import { Button, Modal } from 'antd';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';

import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import Image from '@/models/media/image.model';
import StreetcodeArt, { StreetcodeArtCreateUpdate } from '@/models/media/streetcode-art.model';

import ArtGalleryAdminBlock from './ArtGallery/ArtGalleryAdminBlock.component';
import PreviewImageModal from './PreviewImageModal/PreviewImageModal.component';

interface Props {
    arts: StreetcodeArtCreateUpdate[],
    setArts: React.Dispatch<React.SetStateAction<StreetcodeArtCreateUpdate[]>>,
}

const DownloadBlock = ({ arts, setArts }: Props) => {
    const { streetcodeArtStore } = useMobx();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const uidsFile = useRef<string>('');
    const indexTmp = useRef<number>(0);
    const [visibleModal, setVisibleModal] = useState(false);
    const [visibleDeleteButton, setVisibleDeleteButton] = useState(false);
    const filesToRemove = useRef<UploadFile[]>([])

    useEffect(() => {
        if (arts.length > 0) {
            const newFileList = arts.map((streetcodeArt: StreetcodeArtCreateUpdate) => ({
                uid: `${streetcodeArt.index}`,
                name: streetcodeArt.art.image?.imageDetails?.alt,
                status: 'done',
                thumbUrl: base64ToUrl(streetcodeArt.art.image?.base64, streetcodeArt.art.image?.mimeType) ?? '',
                type: streetcodeArt.art.image?.mimeType,
            }));
            console.log("-useEffect-");
            console.log(arts);
            setFileList(newFileList);
            indexTmp.current = Math.max(...arts.map((x) => x.index)) + 1;
        }
    }, [arts]);

    function compare( a:UploadFile, b:UploadFile ) {
        if ( a.uid < b.uid ){
          return -1;
        }
        if ( a.uid > b.uid ){
          return 1;
        }
        return 0;
      }

    const handleRemove = useCallback((param: UploadFile) => {
        let divsList = document.querySelectorAll(".with-multiple-delete .ant-upload-list-item-container");
        let elem = divsList[Number(param.uid) - 1];

        const filesToRemoveIds = filesToRemove.current.map(file => file.uid);
        console.log(`Incoming id: ${param.uid}`)

        if(filesToRemoveIds.includes(param.uid)){
            for(let i = 0; i < filesToRemoveIds.length; i++)
            {
                if(filesToRemove.current[i].uid == param.uid)
                {
                    filesToRemove.current.splice(i, 1);
                    break;
                }
            }
            elem.classList.remove('delete-border')
        }
        else{
            elem.classList.add("delete-border");
            filesToRemove.current.push(param);
        }
        filesToRemove.current.sort(compare);
        filesToRemove.current.length > 0? setVisibleDeleteButton(true): setVisibleDeleteButton(false)
        console.log(`filesToRemove.current`)
        console.log(filesToRemove.current)
    }, []);

    const handleCancelModalRemove = useCallback(() => {
        setVisibleModal(false);
    }, []);

    const onChange = (uploadParams: UploadChangeParam<UploadFile<any>>) => {
        uidsFile.current = uploadParams.file.uid;
        const status = uploadParams.file.status ?? 'removed';
        if (status !== 'removed') {
            setFileList(uploadParams.fileList.map((x) => x));
        }
    };

    const onPreview = async (file: UploadFile) => {
        setFilePreview(file);
        setIsOpen(true);
    };

    function RemoveDeleteFrames()
    {
        let divsList = document.querySelectorAll(".with-multiple-delete .ant-upload-list-item-container");
        divsList.forEach(element => {
            element.classList.remove('delete-border')
        });
    }

    const onSuccessUpload = (image: Image) => {
        console.log(`index temp after: ${indexTmp.current}`)
        if (arts.length > 0) {
            indexTmp.current = Math.max(...arts.map((x) => x.index)) + 1;
        } else {
            indexTmp.current += 1;
        }
        console.log(`index temp after: ${indexTmp.current}`)
        const newArt: StreetcodeArtCreateUpdate = {
            index: indexTmp.current,
            modelState: ModelState.Created,
            art: {
                id: 0,
                description: '',
                image,
                imageId: image.id,
                title: '',
            },
        };

        setArts([...arts, newArt]);
    };

    function RemoveFile(file: UploadFile)
    {
        const removedArtIndex = arts.findIndex((a) => `${a.index}` === file.uid);

        if (removedArtIndex >= 0) {
            const toRemove = arts[removedArtIndex] as StreetcodeArtCreateUpdate;
            if (arts[removedArtIndex].isPersisted) {
                toRemove.modelState = ModelState.Deleted;
                streetcodeArtStore.setItem(toRemove as StreetcodeArt);
            }

            arts.splice(removedArtIndex, 1);

            // Decrement indexes of all elements after the removed element
            for (let i = removedArtIndex; i < arts.length; i++) {
                arts[i].index -= 1;
            }

            setArts([...arts]);

            // Decrement indexTmp.current if the removed element had the highest index
            if (removedArtIndex === arts.length && indexTmp.current > 0) {
                indexTmp.current -= 1;
            }
        }

        setFileList(fileList => (fileList.filter((x) => x.uid !== file.uid)));
        setVisibleModal(false);
    }

    const onRemoveFile = (files: UploadFile[]) => {
        files.forEach(element => {
            RemoveFile(element);
            files.forEach(file => {
                file.uid = (Number(file.uid) - 1).toString();
            });
            console.log('deleting file')
            console.log(element);
        });
        if (arts.length > 0) {
            indexTmp.current = Math.max(...arts.map((x) => x.index)) + 1;
        } else {
            indexTmp.current = 0;
        }
        console.log('----onRemoveFile---')
        console.log(files);
        filesToRemove.current = [];
        setVisibleDeleteButton(false);
        RemoveDeleteFrames();
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
                onRemove={(e) => handleRemove(e)}
                className='with-multiple-delete'
            >
                {fileList.length < 15 ? <p>+ Додати</p> : <></>}
            </FileUploader>
            {visibleDeleteButton? <Button className="delete-arts-button" danger onClick={()=>setVisibleModal(true)}>Видалити</Button>: <></>}
            <Modal
                title="Ви впевнені, що хочете видалити цей арт?"
                open={visibleModal}
                onOk={(e) => onRemoveFile(filesToRemove.current)}
                onCancel={handleCancelModalRemove}
            />
            {arts.length > 0 ? (
                <>
                    <h4>Попередній перегляд</h4>
                    <ArtGalleryAdminBlock arts={arts} />
                    <PreviewImageModal
                        streetcodeArt={arts[fileList.indexOf(filePreview!)]}
                        opened={isOpen}
                        setOpened={setIsOpen}
                        arts={arts}
                        setArts={setArts}
                    />
                </>
            ) : null}
        </>
    );
};

export default DownloadBlock;
