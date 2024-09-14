/* eslint-disable @typescript-eslint/no-shadow */
import './DownloadStyles.styles.scss';

import { action, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import base64ToUrl from '@app/common/utils/base64ToUrl.utility';
import useMobx from '@app/stores/root-store';
import Draggable from '@components/Draggable/Draggable';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { ModelState } from '@models/enums/model-state';
import { ArtCreateUpdate } from '@models/media/art.model';

import { Button, Modal, Upload, Typography } from 'antd';
const { Text } = Typography;
import type { UploadFile, UploadFileStatus } from 'antd/es/upload/interface';

import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import Image from '@/models/media/image.model';
import Audio from '@/models/media/audio.model';

import PreviewImageModal from './PreviewImageModal/PreviewImageModal.component';
import { checkImageFileType } from '@/app/common/components/modals/validators/imageValidator';

const DownloadBlock = () => {
    const { id } = useParams<any>();
    const parseId = id ? +id : null;

    const { artStore, streetcodeArtSlideStore, artGalleryTemplateStore } = useMobx();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [artPreviewIdx, setArtPreviewIdx] = useState<number>(0);
    const [isOpen, setIsOpen] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [visibleDeleteButton, setVisibleDeleteButton] = useState(false);
    const [visibleError, setVisibleError] = useState(false);
    const artsToRemoveIdxs = useRef<Set<string>>(new Set());
    const isSecondRender = useRef<boolean>(false);

    useAsync(async () => {
        if (artStore.arts.length === 0 && parseId && !isSecondRender.current) {
            isSecondRender.current = true;
            await artStore.fetchArtsByStreetcodeId(parseId);
        }
    });

    useEffect(() => {
        if (artStore.arts.length >= 0) {
            const newFileList = artStore.arts.filter((art) => art.modelState !== ModelState.Deleted).map((art) => ({
                uid: `${art.id}`,
                name: art.image?.imageDetails?.alt || '',
                status: 'done' as UploadFileStatus,
                thumbUrl: base64ToUrl(art.image?.base64, art.image?.mimeType) ?? '',
                type: art.image?.mimeType || '',
            }));
            setFileList(newFileList);
        }
    }, [artStore.arts, artStore.mutationObserved]);

    const isArtInSlides = (id: string) => (
        streetcodeArtSlideStore.hasArtWithId(id, artGalleryTemplateStore.currentTemplateIndexRedact) || artGalleryTemplateStore.hasArtWithId(id)
    );
    

    const handleRemove = useCallback((param: UploadFile) => {
        setVisibleError(false)
        if (isArtInSlides(param.uid)) {
            alert('Ви не можете виділити цей файл для видалення оскільки він є у існуючих слайдах');
            return;
        }
        if (!artsToRemoveIdxs.current.has(param.uid)) {
            artsToRemoveIdxs.current.add(param.uid);
        } else {
            artsToRemoveIdxs.current.delete(param.uid);
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        artsToRemoveIdxs.current.size > 0 ? setVisibleDeleteButton(true) : setVisibleDeleteButton(false);
    }, []);

    const handleCancelModalRemove = useCallback(() => {
        setVisibleModal(false);
    }, []);

    const onPreview = async (file: UploadFile) => {
        setVisibleError(false)
        const artIdx = artStore.arts.findIndex((a) => a.id.toString() === file.uid);
        if (artIdx !== -1) {
            setArtPreviewIdx(artIdx);
            setIsOpen(true);
        }
    };

    const onSuccessUploadImage = action((file: Image | Audio) => {
        setVisibleError(false);
        let image: Image = file as Image;
        const newId = artStore.getMaxArtId + 1;

        const newArt: ArtCreateUpdate = {
            modelState: ModelState.Created,
            isPersisted: false,
            id: newId,
            description: '',
            image,
            imageId: image.id,
            title: '',
        };

        runInAction(() => {
            artStore.arts.push(newArt);
            artStore.toggleMutation();
        });
    });

    function RemoveFile(id: string) {
        const artToRemoveIndex = artStore.arts.findIndex((art) => `${art.id}` === id);

        if (artToRemoveIndex !== -1 && !isArtInSlides(id)) {
            const toRemove = artStore.arts[artToRemoveIndex];

            runInAction(() => {
                if (toRemove.isPersisted) {
                    artStore.arts[artToRemoveIndex].modelState = ModelState.Deleted;
                } else {
                    artStore.arts = artStore.arts.filter((art) => art.id !== toRemove.id);
                }
            });
        }
        setVisibleModal(false);
    }

    const onRemoveArtsSubmit = () => {
        artsToRemoveIdxs.current.forEach((id) => {
            RemoveFile(id);
        });

        artsToRemoveIdxs.current.clear();

        runInAction(() => {
            artStore.toggleMutation();
        });

        setVisibleDeleteButton(false);
    };

    const handleBeforeUpload = (file: UploadFile) => {
        const isImage = checkImageFileType(file.type);
        if (!isImage) {
            setVisibleError(true);
        }

        return isImage || Upload.LIST_IGNORE;
    };

    return (
        <div className="art-gallery-download">
            <FileUploader
                accept=".jpeg,.png,.jpg,.webp"
                listType="picture-card"
                fileList={fileList}
                multiple={true}
                uploadTo="image"
                beforeUpload={handleBeforeUpload}
                onSuccessUpload={onSuccessUploadImage}
                onPreview={onPreview}
                onRemove={handleRemove}
                // @ts-ignore
                onList = {streetcodeArtSlideStore.isArtInSlideByRedact}
                className="with-multiple-delete"
                itemRender={(element, file) => (
                    <Draggable id={file.uid} className={isArtInSlides(file.uid) ? "streetcode-art-preview-green": "streetcode-art-preview"}>
                        <div className={`${artsToRemoveIdxs.current.has(file.uid) ? 'delete-border ' : ' '
                        } `}
                        >
                            {element}
                        </div>
                    </Draggable>
                )}
            >
                <p>+ Додати</p>
            </FileUploader>
            {visibleError &&
                <Text className="arts-error" type="danger">Тільки файли з розширенням webp, jpeg, png, jpg дозволені!</Text>
            }
            {visibleDeleteButton ? (
                <Button
                    className="delete-arts-button"
                    danger
                    onClick={() => {setVisibleModal(true);setVisibleError(false)}}
                >
Видалити
                </Button>
            ) : <></>}
            <Modal
                title="Ви впевнені, що хочете видалити цей арт?"
                open={visibleModal}
                onOk={onRemoveArtsSubmit}
                onCancel={handleCancelModalRemove}
            />

            <PreviewImageModal
                artIdx={artPreviewIdx}
                opened={isOpen}
                setOpened={setIsOpen}
            />
        </div>
    );
};

export default observer(DownloadBlock);
