import './ArtGalleryBlock.styles.scss';

import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { MouseEventHandler, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Settings as SliderSettings } from 'react-slick';
import SLIDER_PROPS from '@components/ArtGallery/constants/sliderProps';
import convertSlidesToTemplates from '@components/ArtGallery/utils/convertSlidesToTemplates';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import StreetcodeArtSlide, { StreetcodeArtSlideCreateUpdate } from '@models/media/streetcode-art-slide.model';
import useMobx, { useStreetcodeDataContext } from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import { Button } from 'antd';

const MAX_SLIDES_AMOUNT = 30;

type Props = {
    adminArtSlides?: StreetcodeArtSlideCreateUpdate[],
    isConfigurationGallery?: boolean
};

const ArtGallery = ({ adminArtSlides, isConfigurationGallery } : Props) => {
    const { streetcodeArtSlideStore, artGalleryTemplateStore } = useMobx();
    const { streetcodeStore: { getStreetCodeId, errorStreetCodeId } } = useStreetcodeDataContext();
    const { fetchNextArtSlidesByStreetcodeId, streetcodeArtSlides } = streetcodeArtSlideStore;
    const [slickProps, setSlickProps] = useState<SliderSettings>(SLIDER_PROPS);

    const { id } = useParams<any>();
    const parseId = id ? +id : null;

    useAsync(
        async () => {
            if (getStreetCodeId !== errorStreetCodeId && !adminArtSlides) {
                let currentSlide = 0;

                while (currentSlide < MAX_SLIDES_AMOUNT) {
                    try {
                        // eslint-disable-next-line no-await-in-loop
                        await fetchNextArtSlidesByStreetcodeId(getStreetCodeId);
                        currentSlide += 1;
                    } catch (error: unknown) {
                        console.log(`%c Loading of ART gallery completed. ${currentSlide} slides of images were downloaded`, 'color: #1BD760');
                        currentSlide = MAX_SLIDES_AMOUNT;
                    }
                }
            }
        },
        [getStreetCodeId],
    );

    useEffect(() => {
        setSlickProps((prev) => ({
            ...prev,
            dots: !prev.dots,
            arrows: !prev.arrows,
            draggable: !prev.draggable,
        }));
    }, [artGalleryTemplateStore.isEdited]);

    return (
        <div>
            {(streetcodeArtSlides.length > 0 || adminArtSlides?.length > 0 || isConfigurationGallery) && (
                <div
                    id="art-gallery"
                    className="artGalleryWrapper"
                >
                    <div className="artGalleryContainer container">
                        <BlockHeading headingText="Арт-галерея" />
                        <div className="artGalleryContentContainer">
                            <div className="artGallerySliderContainer">
                                <SlickSlider {...slickProps}>
                                    {isConfigurationGallery
                                        ? convertSlidesToTemplates(artGalleryTemplateStore.streetcodeArtSlides as StreetcodeArtSlide[], true)
                                        : convertSlidesToTemplates(adminArtSlides as StreetcodeArtSlide[] || streetcodeArtSlides)}

                                </SlickSlider>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {artGalleryTemplateStore.isEdited && isConfigurationGallery
                ? (
                    <div className="configurationGalleryControls">
                        <Button type="primary" onClick={handleAddNewSlide}>Додати</Button>
                        <Button type="danger" onClick={handleClearSlideTemplate}>Скасувати</Button>
                    </div>
                )
                : (<></>)}
        </div>
    );

    function handleAddNewSlide() {
        const newSlide = artGalleryTemplateStore.getEditedSlide() as StreetcodeArtSlide;

        newSlide.index = streetcodeArtSlideStore.streetcodeArtSlides.length + 1;
        newSlide.streetcodeId = parseId ?? -1;

        runInAction(() => {
            streetcodeArtSlideStore.streetcodeArtSlides.push(newSlide);
            console.log('Art slides: ', streetcodeArtSlideStore.streetcodeArtSlides);
        });
    }

    function handleClearSlideTemplate() {
        artGalleryTemplateStore.clearTemplates();
    }
};

export default observer(ArtGallery);
