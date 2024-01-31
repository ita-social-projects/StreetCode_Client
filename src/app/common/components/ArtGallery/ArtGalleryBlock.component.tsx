/* eslint-disable react/jsx-no-bind,@typescript-eslint/no-use-before-define */
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
import { ArtCreateUpdate } from '@models/media/art.model';
import StreetcodeArtSlide from '@models/media/streetcode-art-slide.model';
import useMobx, { useStreetcodeDataContext } from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

import { Button } from 'antd';
import { useMediaQuery } from 'react-responsive';

const MAX_SLIDES_AMOUNT = 30;

type Props = {
    isConfigurationGallery?: boolean
    isAdmin?: boolean
    isFillArtsStore?: boolean
};

const ArtGallery = ({ isAdmin, isConfigurationGallery, isFillArtsStore } : Props) => {
    const { streetcodeArtSlideStore, artGalleryTemplateStore, artStore } = useMobx();
    const { streetcodeStore: { getStreetCodeId, errorStreetCodeId } } = useStreetcodeDataContext();
    const { fetchNextArtSlidesByStreetcodeId, streetcodeArtSlides, amountOfSlides } = streetcodeArtSlideStore;
    const { streetcodeArtSlides: templateArtSlides } = artGalleryTemplateStore;
    const [slickProps, setSlickProps] = useState<SliderSettings>(SLIDER_PROPS);
    const secondRender = useRef(false);
    const isMobile = useMediaQuery({
        query: '(max-width: 680px)',
    });

    const { id } = useParams<any>();
    const parseId = id ? +id : errorStreetCodeId;

    useAsync(
        async () => {
            if (streetcodeIdValidAndFetchingRequired()) {
                secondRender.current = true;
                let currentSlide = 0;

                while (currentSlide < MAX_SLIDES_AMOUNT) {
                    try {
                        // eslint-disable-next-line no-await-in-loop
                        await fetchNextArtSlidesByStreetcodeId(getStreetCodeId !== -1 ? getStreetCodeId : parseId);

                        if (isFillArtsStore) {
                            copyArtsFromSlidesToStore();
                        }

                        currentSlide += amountOfSlides;
                    } catch (error: unknown) {
                        currentSlide = MAX_SLIDES_AMOUNT;
                    }
                }
            }
        },
        [getStreetCodeId, parseId],
    );

    function streetcodeIdValidAndFetchingRequired() {
        return (getStreetCodeId !== errorStreetCodeId || parseId !== errorStreetCodeId)
        && !secondRender.current
        && !isConfigurationGallery;
    }

    function copyArtsFromSlidesToStore() {
        runInAction(() => {
            const mappedArts = streetcodeArtSlides.map(
                (slide) => slide.streetcodeArts.map(
                    (sArt) => sArt.art,
                ),
            );

            artStore.arts = ([] as ArtCreateUpdate[]).concat(...mappedArts);
            artStore.toggleMutation();
        });
    }

    useEffect(() => {
        if (isConfigurationGallery) {
            toggleBlockingOfConfigurationSlider();
        }
    }, [artGalleryTemplateStore.isEdited]);

    function toggleBlockingOfConfigurationSlider() {
        setSlickProps((prev) => ({
            ...prev,
            dots: !prev.dots,
            arrows: !prev.arrows,
            draggable: !prev.draggable,
        }));
    }

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
                                {isMobile
                                    ? isConfigurationGallery
                                        ? convertSlidesToTemplates(templateArtSlides as StreetcodeArtSlide[], true)
                                        : convertSlidesToTemplates(
                                            streetcodeArtSlideStore.getVisibleSortedSlides() as StreetcodeArtSlide[],
                                            false,
                                            isAdmin,
                                        )
                                    : <SlickSlider {...slickProps}>
                                        {isConfigurationGallery
                                            ? convertSlidesToTemplates(templateArtSlides as StreetcodeArtSlide[], true)
                                            : convertSlidesToTemplates(
                                                streetcodeArtSlideStore.getVisibleSortedSlides() as StreetcodeArtSlide[],
                                                false,
                                                isAdmin,
                                            )}
                                    </SlickSlider>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {artGalleryTemplateStore.isEdited && isConfigurationGallery
                ? (
                    <div className="configurationGalleryControls">
                        <Button type="primary" onClick={handleAddNewSlide}>Додати</Button>
                        <Button danger onClick={handleClearSlideTemplate}>Скасувати</Button>
                    </div>
                )
                : (<></>)}
        </div>
    );
};

export default observer(ArtGallery);
