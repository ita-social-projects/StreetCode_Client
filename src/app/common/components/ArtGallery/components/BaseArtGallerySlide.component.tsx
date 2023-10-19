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

    function onEditSlideClick() {
        const slide = streetcodeArtSlideStore.streetcodeArtSlides.find((s) => s.index === slideIndex);
        if (slide) {
            const slideClone = JSON.parse(JSON.stringify(slide));
            artGalleryTemplateStore.streetcodeArtSlides = [slideClone];
            artGalleryTemplateStore.isEdited = true;
        }
    }

    function onDeleteSlideClick() {
        // eslint-disable-next-line max-len
        const slideIndexInArtsArray = streetcodeArtSlideStore.streetcodeArtSlides.findIndex((s) => s.index === slideIndex);
        const slide = streetcodeArtSlideStore.streetcodeArtSlides.find((s) => s.index === slideIndex);

        if (slideIndex !== -1 && slide) {
            if (slide.isPersisted === false) {
                streetcodeArtSlideStore.streetcodeArtSlides.splice(slideIndexInArtsArray, 1);
            } else {
                // eslint-disable-next-line max-len
                streetcodeArtSlideStore.streetcodeArtSlides[slideIndexInArtsArray] = { ...slide, modelState: ModelState.Deleted };
            }
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
            label: <button onClick={() => console.log('Second option')}>coming soon..</button>,
            key: '2',
        },
    ];

    return (
        <div className={`${className} base-art-slide`}>
            {streetcodeArts?.map((streetcodeArt) => {
                const { image } = streetcodeArt.art;
                const imageJSX = (
                    <img
                        className={`base-art-image img${streetcodeArt.index}`}
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
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <MoreOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                )
                : <></>}
        </div>
    );
};

export default BaseArtGallerySlide;
