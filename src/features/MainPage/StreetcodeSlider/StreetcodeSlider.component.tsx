import './StreetcodeSlider.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import useMobx from '@stores/root-store';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';

import STREETCODE_SLIDER_PROPS from './constants/streetcodeSliderProps.constant';
import StreetcodeSliderItem from './StreetcodeSliderItem/StreetcodeSliderItem.component';

const StreetcodeSlider = () => {
    const MAX_STREETCODES_LOADED = 3;
    const { imagesStore, streetcodeMainPageStore } = useMobx();
    const [notAllowedIntersectionIndexes, setNotAllowedIntersectionIndexes] = useState<number[]>([]);
    const windowsize = useWindowSize();
    if (windowsize.width <= 1024) {
        if (windowsize.width >= 768) {
            STREETCODE_SLIDER_PROPS.centerMode = true;
            STREETCODE_SLIDER_PROPS.initialSlide = 1;
        }
        STREETCODE_SLIDER_PROPS.dots = true;
    }

    if (windowsize.width <= 768) STREETCODE_SLIDER_PROPS.variableWidth = false;

    const LoadStreetcode = async (index : number) => {
        await streetcodeMainPageStore.fetchLastStreetcodeWithOffset(index)
            .then(async () => imagesStore.fetchImage(streetcodeMainPageStore.getStreetcodesArray[index]?.imageId));
    };

    useEffect(() => {
        for (let i = 0; i < MAX_STREETCODES_LOADED; i += 1) {
            if (i !== MAX_STREETCODES_LOADED - 1) {
                setNotAllowedIntersectionIndexes([...notAllowedIntersectionIndexes, i]);
                LoadStreetcode(i);
            } else {
                setNotAllowedIntersectionIndexes(
                    [...notAllowedIntersectionIndexes, streetcodeMainPageStore.STREETCODE_MAX_AMOUNT - 1],
                );
                LoadStreetcode(streetcodeMainPageStore.STREETCODE_MAX_AMOUNT - 1);
            }
        }
    }, []);

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
                                                {streetcodeMainPageStore.getStreetcodesArray.map((item, index) => (
                                                    <div key={item?.id} className="slider-item">
                                                        <StreetcodeSliderItem
                                                            index={index}
                                                            streetcode={item}
                                                            image={imagesStore.getImage(item?.imageId)}
                                                            allowIntersection={
                                                                !(index in notAllowedIntersectionIndexes)
                                                            }
                                                        />
                                                    </div>
                                                ))}
                                            </SlickSlider>
                                        )
                                        : <></>
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
