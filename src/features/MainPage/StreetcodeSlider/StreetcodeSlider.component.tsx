/* eslint-disable no-await-in-loop */
import './StreetcodeSlider.styles.scss';

import { observer } from 'mobx-react-lite';
import { useRef, useState } from 'react';
import ImagesApi from '@api/media/images.api';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Image from '@models/media/image.model';

import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
// eslint-disable-next-line import/extensions
import { paginateRequest } from '@/app/common/utils/paginateRequest';
import { StreetcodeMainPage } from '@/models/streetcode/streetcode-types.model';

import STREETCODE_SLIDER_PROPS from './constants/streetcodeSliderProps.constant';
import StreetcodeSliderItem from './StreetcodeSliderItem/StreetcodeSliderItem.component';

const DEFAULT_STREETCODE_CARDS_AMOUNT = 32;

const StreetcodeSlider = () => {
    const [streetcodes, setStreetcodes] = useState<StreetcodeMainPage[]>([]);
    const [images, setImages] = useState<Image[]>([]);
    const loading = useRef(false);

    const windowsize = useWindowSize();
    if (windowsize.width <= 1024 && windowsize.width >= 768) STREETCODE_SLIDER_PROPS.centerMode = true;
    if (windowsize.width <= 1024) STREETCODE_SLIDER_PROPS.dots = true;
    if (windowsize.width <= 1024 && windowsize.width >= 768) STREETCODE_SLIDER_PROPS.initialSlide = 1;
    if (windowsize.width <= 768) STREETCODE_SLIDER_PROPS.variableWidth = false;

    useAsync(async () => {
        const shuffleSeed = Math.floor(Date.now() / 1000);
        const { fetchNextPage } = paginateRequest(3, StreetcodesApi.getPageMainPage, { shuffleSeed });

        let streetcodesAmount: number;
        if (!loading.current) {
            loading.current = true;
            try {
                streetcodesAmount = await StreetcodesApi.getCount(true);
            } catch (e: any) {
                streetcodesAmount = DEFAULT_STREETCODE_CARDS_AMOUNT;
            }

            const emptyStreetcodes = Array(streetcodesAmount).fill({});
            setStreetcodes(emptyStreetcodes);

            while (true) {
                try {
                    const [newStreetcodes, startIdx, endIdx] = await fetchNextPage();
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    setStreetcodes((prevState) => {
                        // replace empty objects to fetched streetcode
                        const newState = [
                            ...prevState.slice(0, startIdx),
                            ...newStreetcodes,
                            ...prevState.slice(endIdx),
                        ];

                        return newState;
                    });

                    const newImages: Image[] = [];
                    const promises = [];

                    // eslint-disable-next-line no-plusplus
                    for (let i = 0; i < newStreetcodes.length; i++) {
                        promises.push(ImagesApi.getById(newStreetcodes[i].imageId).then((img) => {
                            newImages[i] = img;
                        }));
                    }

                    await Promise.all(promises).then(() => {
                        setImages((prevState) => [...prevState, ...newImages].slice(0, streetcodesAmount));
                    });
                } catch (error: unknown) {
                    break;
                }
            }
        }
    });

    return (
        <div>
            <div className="streetcodeMainPageWrapper">
                <div id="streetcodeSliderContentBlock" className="streetcodeSliderComponent">
                    <div className="streetcodeSliderContainer">
                        <div className="blockCenter">
                            <div className="streetcodeSliderContent">
                                {
                                    streetcodes.length > 0
                                        ? (
                                            <SlickSlider {...STREETCODE_SLIDER_PROPS}>
                                                {streetcodes.map((item, index) => (
                                                    <div key={item.id} className="slider-item">
                                                        <StreetcodeSliderItem
                                                            streetcode={item}
                                                            image={images[index]}
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
