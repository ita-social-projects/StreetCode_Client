import './ArtGalleryBlock.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import ALL_SLIDES_TEMPLATES from '@components/ArtGallery/constants/allSlidesTemplates';
import SLIDER_PROPS from '@components/ArtGallery/constants/sliderProps';
import convertSlidesToTemplates from '@components/ArtGallery/utils/convertSlidesToTemplates';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import StreetcodeArtSlide from '@models/media/streetcode-art-slide.model';
import useMobx, { useStreetcodeDataContext } from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';

const MAX_SLIDES_AMOUNT = 30;

type Props = {
    adminArtSlides?: StreetcodeArtSlide[]
    isConfigurationGallery?: boolean
};

const ArtGallery = ({ adminArtSlides, isConfigurationGallery } : Props) => {
    const { streetcodeArtStore, artGalleryTemplateStore } = useMobx();
    const { streetcodeStore: { getStreetCodeId, errorStreetCodeId } } = useStreetcodeDataContext();
    const { fetchNextArtSlidesByStreetcodeId, streetcodeArtSlides } = streetcodeArtStore;

    useEffect(() => {
        console.log('CHANGE DEPENDENCY', artGalleryTemplateStore.streetcodeArtSlides);
    }, [artGalleryTemplateStore.streetcodeArtSlides]);

    useAsync(
        async () => {
            console.log(getStreetCodeId, errorStreetCodeId, adminArtSlides);
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
                                <SlickSlider {...SLIDER_PROPS}>
                                    {isConfigurationGallery
                                        ? convertSlidesToTemplates(artGalleryTemplateStore.streetcodeArtSlides, true)
                                        : convertSlidesToTemplates(adminArtSlides || streetcodeArtSlides)}

                                </SlickSlider>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default observer(ArtGallery);
