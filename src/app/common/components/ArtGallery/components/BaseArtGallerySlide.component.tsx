/* eslint-disable react/button-has-type */
import './BaseArtGallerySlide.styles.scss';

import { MoreOutlined } from '@ant-design/icons';
import SlidePropsType from '@components/ArtGallery/types/SlidePropsType';
import Droppable from '@components/Droppable/Droppable';
import { ModelState } from '@models/enums/model-state';
import useMobx from '@stores/root-store';
import base64ToUrl from '@utils/base64ToUrl.utility';

import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';

const BaseArtGallerySlide = ({
    streetcodeArts, className, artSlideId, isDroppable, isAdmin, slideIndex,
}: SlidePropsType & { className: string }) => {
    const { streetcodeArtSlideStore, artGalleryTemplateStore } = useMobx();
    const { streetcodeArtSlides } = streetcodeArtSlideStore;

    function onEditSlideClick() {
        const slide = streetcodeArtSlides.find((s) => s.index === slideIndex);
        if (slide) {
            const slideClone = JSON.parse(JSON.stringify(slide));
            artGalleryTemplateStore.streetcodeArtSlides = [slideClone];
            artGalleryTemplateStore.isEdited = true;
        }
    }

    function onDeleteSlideClick() {
        const slideIndexInArtsArray = streetcodeArtSlides.findIndex((s) => s.index === slideIndex);
        const slide = streetcodeArtSlides.find((s) => s.index === slideIndex);

        if (slideIndex !== -1 && slide) {
            if (slide.isPersisted === false) {
                streetcodeArtSlides.splice(slideIndexInArtsArray, 1);
            } else {
                streetcodeArtSlides[slideIndexInArtsArray] = { ...slide, modelState: ModelState.Deleted };
            }
        }
    }

    function onMoveSlideBackward() {
        const currentSlide = streetcodeArtSlides.find(
            (s) => s.index === slideIndex,
        );
        const prevSlide = streetcodeArtSlides.find(
            (s) => s.index === slideIndex - 1,
        );

        if (currentSlide && prevSlide) {
            currentSlide.index -= 1;
            prevSlide.index += 1;
        }
    }

    function onMoveSlideForward() {
        const currentSlide = streetcodeArtSlides.find(
            (s) => s.index === slideIndex,
        );
        const nextSlide = streetcodeArtSlides.find(
            (s) => s.index === slideIndex + 1,
        );

        if (currentSlide && nextSlide) {
            currentSlide.index += 1;
            nextSlide.index -= 1;
        }
    }

    const editDropdownOptions: MenuProps['items'] = [
        {
            label: <button onClick={onEditSlideClick}>Редагувати</button>,
            key: '0',
        },
        {
            label: <button onClick={onDeleteSlideClick}>Видалити слайд</button>,
            key: '1',
        },
        {
            label: <button onClick={onMoveSlideForward}>Пересунути вперід</button>,
            key: '2',
            disabled: (streetcodeArtSlideStore.findBySlideIndex(slideIndex)?.index || -1)
                >= streetcodeArtSlides.length - 1,
        },
        {
            label: <button onClick={onMoveSlideBackward}>Пересунути назад</button>,
            key: '3',
            disabled: (streetcodeArtSlideStore.findBySlideIndex(slideIndex)?.index || -1) <= 1,
        },
    ];

    return (
        <div className={`${className} base-art-slide`}>
            {streetcodeArts?.map((streetcodeArt) => {
                const { image } = streetcodeArt.art;
                const imageJSX = (
                    <img
                        className="base-art-image"
                        src={base64ToUrl(image.base64, image.mimeType)}
                        alt={image.imageDetails?.title}
                    />
                );

                return isDroppable
                    ? <Droppable id={`${artSlideId}-${streetcodeArt.index}`}>{imageJSX}</Droppable>
                    : imageJSX;
            })}
            {isAdmin
                ? (
                    <Dropdown
                        menu={{ items: editDropdownOptions }}
                        trigger={['click']}
                        className="admin-options-btn"
                        placement="bottom"
                    >
                        <Space>
                            <MoreOutlined />
                        </Space>
                    </Dropdown>
                )
                : <></>}
        </div>
    );
};

export default BaseArtGallerySlide;
