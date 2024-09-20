import './StreetcodeSlider.styles.scss';

import { observer } from 'mobx-react-lite';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import useMobx from '@stores/root-store';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';

import STREETCODE_SLIDER_PROPS from './constants/streetcodeSliderProps.constant';
import StreetcodeSliderItem from './StreetcodeSliderItem/StreetcodeSliderItem.component';

const DEFAULT_STREETCODE_CARDS_AMOUNT = 10;

const StreetcodeSlider = () => {
    const { imagesStore, streetcodeMainPageStore } = useMobx();
    const windowsize = useWindowSize();

    if (windowsize.width <= 1024) {
        STREETCODE_SLIDER_PROPS.dots = true;

        if (windowsize.width >= 768) {
            STREETCODE_SLIDER_PROPS.centerMode = true;
            STREETCODE_SLIDER_PROPS.initialSlide = 0;
        }
    }

    streetcodeMainPageStore.fetchStreetcodesMainPage(1, DEFAULT_STREETCODE_CARDS_AMOUNT);
    imagesStore.fetchImages(streetcodeMainPageStore.getStreetcodesArray || []);

    return (
        <div>
            <div className="streetcodeMainPageWrapper">
                <div id="streetcodeSliderContentBlock" className="streetcodeSliderComponent">
                    <div className="streetcodeSliderContainer">
                        <div className="blockCenter">
                            <div className="streetcodeSliderContent">
                                {
                                    streetcodeMainPageStore.getStreetcodesArray.length > 0
                                        ? (
                                            <SlickSlider {...STREETCODE_SLIDER_PROPS}>
                                                {streetcodeMainPageStore.getStreetcodesArray.map((item) => (
                                                    <div key={item.id} className="slider-item">
                                                        <StreetcodeSliderItem
                                                            streetcode={item}
                                                            image={imagesStore.getImage(item.imageId)}
                                                        />
                                                    </div>
                                                ))}
                                            </SlickSlider>
                                        )
                                        : <> </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(StreetcodeSlider);
