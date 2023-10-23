/* eslint-disable @typescript-eslint/no-shadow */
import './DownloadStyles.styles.scss';

import { action } from 'mobx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import base64ToUrl from '@app/common/utils/base64ToUrl.utility';
import useMobx from '@app/stores/root-store';
import Draggable from '@components/Draggable/Draggable';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { ModelState } from '@models/enums/model-state';
import { ArtCreateUpdate } from '@models/media/art.model';

import { Button, Modal } from 'antd';
import type { UploadFile, UploadFileStatus } from 'antd/es/upload/interface';

import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import Image from '@/models/media/image.model';

import PreviewImageModal from './PreviewImageModal/PreviewImageModal.component';

const DownloadBlock = React.memo(() => {
    const { id } = useParams<any>();
    const parseId = id ? +id : null;

    const { artStore, streetcodeArtSlideStore, artGalleryTemplateStore } = useMobx();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [artPreviewIdx, setArtPreviewIdx] = useState<number>(0);
    const [isOpen, setIsOpen] = useState(false);
    const [toggleMutatedArts, setToggleMutatedArts] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [visibleDeleteButton, setVisibleDeleteButton] = useState(false);
    const artsToRemoveIdxs = useRef<Set<string>>(new Set());

    useAsync(async () => {
        if (artStore.arts.length === 0 && parseId) {
            await artStore.fetchArtsByStreetcodeId(parseId);
        }
    });

    useEffect(() => {
        console.log('MAPPING FROM ARTS');
        if (artStore.arts.length > 0) {
            const newFileList = artStore.arts.filter((art) => art.modelState !== ModelState.Deleted).map((art) => ({
                uid: `${art.id}`,
                name: art.image?.imageDetails?.alt || '',
                status: 'done' as UploadFileStatus,
                thumbUrl: base64ToUrl(art.image?.base64, art.image?.mimeType) ?? '',
                type: art.image?.mimeType || '',
            }));
            setFileList(newFileList);
        }
    }, [toggleMutatedArts, artStore.arts]);

    const handleRemove = useCallback((param: UploadFile) => {
        if (streetcodeArtSlideStore.hasArtWithId(param.uid)
        || artGalleryTemplateStore.hasArtWithId(param.uid)) {
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
        const artIdx = artStore.arts.findIndex((a) => a.id.toString() === file.uid);
        if (artIdx !== -1) {
            setArtPreviewIdx(artIdx);
            setIsOpen(true);
        }
    };

    const onSuccessUpload = action((image: Image) => {
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

        artStore.arts.push(newArt);
        setToggleMutatedArts((toggle) => !toggle);
    });

    function RemoveFile(id: string) {
        const artToRemoveIndex = artStore.arts.findIndex((art) => `${art.id}` === id);

        if (artToRemoveIndex !== -1) {
            const toRemove = artStore.arts[artToRemoveIndex];

            if (toRemove.isPersisted) {
                artStore.arts[artToRemoveIndex].modelState = ModelState.Deleted;
            } else {
                artStore.arts = artStore.arts.filter((art) => art.id !== toRemove.id);
            }
            console.log(artStore.arts);
        }
        setVisibleModal(false);
    }

    const onRemoveArtsSubmit = () => {
        artsToRemoveIdxs.current.forEach((id) => {
            RemoveFile(id);
        });
        artsToRemoveIdxs.current.clear();
        setToggleMutatedArts((toggle) => !toggle);
        setVisibleDeleteButton(false);
    };

    return (
        <>
            <FileUploader
                accept=".jpeg,.png,.jpg,.webp"
                listType="picture-card"
                fileList={fileList}
                onPreview={onPreview}
                uploadTo="image"
                onSuccessUpload={onSuccessUpload}
                onRemove={(e) => handleRemove(e)}
                className="with-multiple-delete"
                itemRender={(element, file) => (
                    <Draggable id={file.uid}>
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
            {visibleDeleteButton ? (
                <Button
                    className="delete-arts-button"
                    danger
                    onClick={() => setVisibleModal(true)}
                >
Видалити
                </Button>
            ) : <></>}
            <Modal
                title="Ви впевнені, що хочете видалити цей арт?"
                open={visibleModal}
                onOk={(e) => onRemoveArtsSubmit()}
                onCancel={handleCancelModalRemove}
            />

            <PreviewImageModal
                artIdx={artPreviewIdx}
                opened={isOpen}
                setOpened={setIsOpen}
            />
        </>
    );
});

export default DownloadBlock;
