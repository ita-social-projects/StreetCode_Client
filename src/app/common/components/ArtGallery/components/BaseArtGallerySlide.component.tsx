/* eslint-disable react/button-has-type */
import './BaseArtGallerySlide.styles.scss';

import { runInAction } from 'mobx';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { SettingOutlined } from '@ant-design/icons';
import SlidePropsType from '@components/ArtGallery/types/SlidePropsType';
import Droppable from '@components/Droppable/Droppable';
import { ModelState } from '@models/enums/model-state';
import useMobx, { useModalContext } from '@stores/root-store';
import base64ToUrl from '@utils/base64ToUrl.utility';

import type { MenuProps } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Dropdown, Modal, Space } from 'antd';
import StreetcodeArt from '@/models/media/streetcode-art.model';
import { TEMPLATE_IMAGE_BASE64 } from '../constants/allSlidesTemplates';
import { ArtSlideTemplateEnum } from '@/models/enums/art-slide-template';

const BaseArtGallerySlide = ({
    streetcodeArts, className, artSlideId, isDroppable, isAdmin, isConfigurationGallery, slideIndex,
}: SlidePropsType & { className: string }) => {
    const { streetcodeArtSlideStore, artGalleryTemplateStore, artStore } = useMobx();
    const { streetcodeArtSlides } = streetcodeArtSlideStore;
    const { modalStore: { setModal } } = useModalContext();
    const [confirmationModalVisibility, setConfirmationModalVisibility] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const isDesktop = useMediaQuery({
        query: '(min-width: 1025px)',
    });
    const [slideIndexInArtsArray, setSlideIndexInArtsArray] = useState(-1);

    useEffect(() => {
        const index = streetcodeArtSlides.findIndex((s) => s.index === slideIndex);
        setSlideIndexInArtsArray(index);
    }, [streetcodeArtSlides, slideIndex]);

    function onEditSlideClick() {
        const slide = streetcodeArtSlides.find((s) => s.index === slideIndex);
        if (slide) {
            const slideClone = JSON.parse(JSON.stringify(slide));

            runInAction(() => {
                artGalleryTemplateStore.streetcodeArtSlides = [slideClone];
                artGalleryTemplateStore.isRedact = true;
                artGalleryTemplateStore.currentTemplateIndexRedact = slideIndex-1;
            });

            document.getElementById("config-art-gallery")?.scrollIntoView({behavior: "smooth", block: "end"});
        }
    }

    function onDeleteSlideClick() {
        const slideIndexInArtsArray = streetcodeArtSlides.findIndex((s) => s.index === slideIndex);
        const slide = streetcodeArtSlides.find((s) => s.index === slideIndex);

        if (slideIndex !== -1 && slide) {
            runInAction(() => {
                if (slide.isPersisted === false) {
                    streetcodeArtSlides.splice(slideIndexInArtsArray, 1);
                } else {
                    streetcodeArtSlides[slideIndexInArtsArray] = { ...slide, modelState: ModelState.Deleted }; 
                }
            });
        }
        setConfirmationModalVisibility(false)
        streetcodeArtSlideStore.isArtInSlideByRedact = false;
    streetcodeArtSlideStore.isArtInSlideByRedact = true;
    }

    const onDeleteSlide = () => {
        if (artGalleryTemplateStore.isRedact){
            alert("Ви у режимі редагування! Завершіть редагування")
            return;
        }
        setConfirmationModalVisibility(true)
    }


    function onMoveSlideBackward() {
        if (artGalleryTemplateStore.isRedact){
            alert("Ви у режимі редагування! Завершіть редагування")
            return;
        }
        const currentSlide = streetcodeArtSlides.find(
            (s) => s.index === slideIndex,
        );
        const prevSlide = streetcodeArtSlides.find(
            (s) => s.index === slideIndex - 1,
        );

        if (currentSlide && prevSlide) {
            runInAction(() => {
                currentSlide.index -= 1;
                prevSlide.index += 1;
            });
        }
    }

    function onMoveSlideForward() {
        if (artGalleryTemplateStore.isRedact){
            alert("Ви у режимі редагування! Завершіть редагування")
            return;
        }
        const currentSlide = streetcodeArtSlides.find(
            (s) => s.index === slideIndex,
        );
        const nextSlide = streetcodeArtSlides.find(
            (s) => s.index === slideIndex + 1,
        );

        if (currentSlide && nextSlide) {
            runInAction(() => {
                currentSlide.index += 1;
                nextSlide.index -= 1;
            });
        }
    }

    function checkMoveSlideForward(slideIndex: number): boolean {
        let sortedSlides = streetcodeArtSlideStore.getVisibleSortedSlidesWithoutParam();
        if (sortedSlides.length > 0) {
            let lengthSlides = sortedSlides.length;
            return slideIndex >= sortedSlides[lengthSlides - 1].index
        }
        return false;
    }

    function checkMoveSlideBackward(slideIndex: number): boolean {
        let sortedSlides = streetcodeArtSlideStore.getVisibleSortedSlidesWithoutParam();
        if (sortedSlides.length > 0) {
            return slideIndex <= sortedSlides[0].index
        }
        return false;
    }
    const editDropdownOptions: MenuProps['items'] = [
        {
            label: <button onClick={onEditSlideClick}>Редагувати</button>,
            key: '0',
        },
        {
            label: <button onClick={onDeleteSlide}>Видалити слайд</button>,
            key: '1',
        },
        {
            label: <button onClick={onMoveSlideForward}>Пересунути вперед</button>,
            key: '2',
            disabled: checkMoveSlideForward(slideIndex),
        },
        {
            label: <button onClick={onMoveSlideBackward}>Пересунути назад</button>,
            key: '3',
            disabled: checkMoveSlideBackward(slideIndex),
        },
    ];
    const handleMouseDown = () => {
        setIsDragging(false);
    };

    const handleMouseMove = () => {
        setIsDragging(true);
    };
    const handleImageClick = (streetcodeArt: StreetcodeArt) => {
        if (!isDroppable && !isDragging) {
            setModal('artGallery', streetcodeArt.art.id);
            
        }
    };

    const handleRemoveArt = (template: ArtSlideTemplateEnum, index: number) => {
        artGalleryTemplateStore.removeArtInSlide(template, index);
    };

    return (
        <div className={`${className} baseArtSlide`}>
            {streetcodeArts?.map((streetcodeArt, index) => {
                const { image } = streetcodeArt.art;
                const imageJSX = (
                    <div className={`baseArtSlideImageWrapper img${streetcodeArt.index}`} key={index}>
                        <img
                            className={`baseArtImage img${streetcodeArt.index}`}
                            src={base64ToUrl(image.base64, image.mimeType)}
                            alt={image.imageDetails?.title}
                            onMouseDown={handleMouseDown}
                           
            onMouseMove={handleMouseMove}
            onClick={() => handleImageClick(streetcodeArt)}
                        />
                        {
                            image.base64 !== TEMPLATE_IMAGE_BASE64 && isConfigurationGallery && 
                            <DeleteOutlined className='deleteBaseArtImage' onClick={() => handleRemoveArt(artSlideId, streetcodeArt.index)}/>
                        }
                        {isDesktop && (
                            <div
                                className={`imgData 
                                imgData${streetcodeArt.art.description || streetcodeArt.art.title ? 'Full' : 'Empty'
                                    }`}
                            >
                                <p className="imgTitle">{streetcodeArt.art.title}</p>
                                <p className="imgDescription">{streetcodeArt.art.description}</p>
                            </div>
                        )}
                    </div>
                );

                return isDroppable
                    ? (
                        <Droppable
                            key={index}
                            id={`${artSlideId}-${streetcodeArt.index}`}
                            className={`droppable${streetcodeArt.index}`}
                        >
                            {imageJSX}
                        </Droppable>
                    )
                    : imageJSX;
            })}
            {isAdmin
                ? (
                    <>
                        <Dropdown
                            menu={{ items: editDropdownOptions }}
                            trigger={['click']}
                            className="adminOptionsBtn"
                            placement="bottom"
                        >
                            <Space>
                                <SettingOutlined style={{ fontSize: '28px' }} />
                            </Space>
                        </Dropdown>
                        <Modal
                            title="Ви впевнені, що хочете видалити цей слайд?"
                            open={confirmationModalVisibility}
                            onOk={(e) => onDeleteSlideClick()}
                            onCancel={() => setConfirmationModalVisibility(false)}
                        />
                    </>
                )
                : <></>}
        </div>
    );
};

export default BaseArtGallerySlide;
