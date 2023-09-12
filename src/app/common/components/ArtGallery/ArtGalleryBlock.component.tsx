import './ArtGalleryBlock.styles.scss';
import { observer } from 'mobx-react-lite';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx, { useStreetcodeDataContext } from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import SLIDER_PROPS from "@components/ArtGallery/constants/sliderProps"
import convertSlidesToTemplates from "@components/ArtGallery/utils/convertSlidesToTemplates"

const MAX_SLIDES_AMOUNT = 30;

const ArtGallery = () => {
    const { streetcodeArtStore } = useMobx();
    const { streetcodeStore: { getStreetCodeId, errorStreetCodeId } } = useStreetcodeDataContext();
    const { fetchNextArtSlidesByStreetcodeId, streetcodeArtSlides } = streetcodeArtStore;

    useAsync(
        async () => {
            if (getStreetCodeId !== errorStreetCodeId) {
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

    // const url = base64ToUrl(image.base64, image.mimeType);

    return (
        <div>
            {streetcodeArtSlides.length > 0 && <div id="art-gallery"
                className="artGalleryWrapper"
            >
                <div className="artGalleryContainer container">
                    <BlockHeading headingText="Арт-галерея" />
                    <div className="artGalleryContentContainer">
                        <div className="artGallerySliderContainer">
                            <SlickSlider {...SLIDER_PROPS}>
                                {convertSlidesToTemplates(streetcodeArtSlides)}
                            </SlickSlider>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    );
};

export default observer(ArtGallery);
