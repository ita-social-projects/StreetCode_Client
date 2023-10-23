/* eslint-disable react/jsx-no-bind */
import './ArtGalleryBlock.styles.scss';

import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Settings as SliderSettings } from 'react-slick';
import SLIDER_PROPS from '@components/ArtGallery/constants/sliderProps';
import convertSlidesToTemplates from '@components/ArtGallery/utils/convertSlidesToTemplates';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import StreetcodeArtSlide from '@models/media/streetcode-art-slide.model';
import useMobx, { useStreetcodeDataContext } from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import { Button } from 'antd';

const MAX_SLIDES_AMOUNT = 30;

type Props = {
    isConfigurationGallery?: boolean
    isAdmin?: boolean
};

const ArtGallery = ({ isAdmin, isConfigurationGallery } : Props) => {
    const { streetcodeArtSlideStore, artGalleryTemplateStore } = useMobx();
    const { streetcodeStore: { getStreetCodeId, errorStreetCodeId } } = useStreetcodeDataContext();
    const { fetchNextArtSlidesByStreetcodeId, streetcodeArtSlides, amountOfSlides } = streetcodeArtSlideStore;
    const { streetcodeArtSlides: templateArtSlides } = artGalleryTemplateStore;
    const [slickProps, setSlickProps] = useState<SliderSettings>(SLIDER_PROPS);
    const secondRender = useRef(false);

    const { id } = useParams<any>();
    const parseId = id ? +id : errorStreetCodeId;

    useAsync(
        async () => {
            if ((getStreetCodeId !== errorStreetCodeId || parseId !== errorStreetCodeId)
                && !secondRender.current
                && !isConfigurationGallery) {
                secondRender.current = true;
                let currentSlide = 0;

                while (currentSlide < MAX_SLIDES_AMOUNT) {
                    try {
                        // eslint-disable-next-line no-await-in-loop
                        await fetchNextArtSlidesByStreetcodeId(getStreetCodeId !== -1 ? getStreetCodeId : parseId);
                        currentSlide += amountOfSlides;
                    } catch (error: unknown) {
                        currentSlide = MAX_SLIDES_AMOUNT;
                    }
                }
            }
        },
        [getStreetCodeId, parseId],
    );

    useEffect(() => {
        if (isConfigurationGallery) {
            setSlickProps((prev) => ({
                ...prev,
                dots: !prev.dots,
                arrows: !prev.arrows,
                draggable: !prev.draggable,
            }));
        }
    }, [artGalleryTemplateStore.isEdited]);

    function handleAddNewSlide() {
        const newSlide = artGalleryTemplateStore.getEditedSlide() as StreetcodeArtSlide;

        if (!newSlide) {
            alert('Увага, заповніть усі зображення щоб зберегти слайд');
            return;
        }

        if (newSlide.streetcodeId !== -1) {
            runInAction(() => {
                const oldSlideIdx = streetcodeArtSlides.findIndex((s) => s.index === newSlide.index);
                if (oldSlideIdx !== -1) {
                    streetcodeArtSlides[oldSlideIdx] = newSlide;
                }
            });
        } else {
            newSlide.index = streetcodeArtSlides.length + 1;
            newSlide.streetcodeId = parseId ?? -1;

            runInAction(() => {
                streetcodeArtSlides.push(newSlide);
            });
        }
    }

    function handleClearSlideTemplate() {
        artGalleryTemplateStore.clearTemplates();
    }

    return (
        <div>
            {(streetcodeArtSlides.length > 0 || isConfigurationGallery) && (
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
                                        ? convertSlidesToTemplates(templateArtSlides as StreetcodeArtSlide[], true)
                                        : convertSlidesToTemplates(
                                            streetcodeArtSlideStore.getVisibleSortedSlides() as StreetcodeArtSlide[],
                                            false,
                                            isAdmin,
                                        )}
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
};

export default observer(ArtGallery);
