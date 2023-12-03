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

import StreetcodeSliderItem from './StreetcodeSliderItem/StreetcodeSliderItem.component';

const StreetcodeSlider = () => {
    const [streetcodes, setStreetcodes] = useState<StreetcodeMainPage[]>([]);
    const [images, setImages] = useState<Image[]>([]);
    const loading = useRef(false);

    const props = {
        touchAction: 'pan-y',
        touchThreshold: 25,
        transform: 'translateZ(0)',
        arrows: false,
        dots: false,
        infinite: true,
        variableWidth: true,
        slidesToShow: 1,
        swipeOnClick: false,
        centerMode: false,
        initialSlide: 0,
    };

    const windowsize = useWindowSize();
    if (windowsize.width <= 1024 && windowsize.width >= 768) props.centerMode = true;
    if (windowsize.width <= 1024) props.dots = true;
    if (windowsize.width <= 1024 && windowsize.width >= 768) props.initialSlide = 1;
    if (windowsize.width <= 768) props.variableWidth = false;

    useAsync(async () => {
        const shuffleSeed = Math.floor(Date.now() / 1000);
        const { fetchNextPage } = paginateRequest(3, StreetcodesApi.getPageMainPage, { shuffleSeed });

        let streetcodesAmount: number;
        if (!loading.current) {
            loading.current = true;
            try {
                streetcodesAmount = await StreetcodesApi.getCount(true);
            } catch (e: any) {
                streetcodesAmount = 32; // fetch 32 streetcodes if StreetcodesApi.getCount fails
            }

            const emptyStreetcodes = Array(streetcodesAmount).fill({});
            setStreetcodes(emptyStreetcodes);

            while (true) {
                try {
                    const [newStreetcodes, startIdx, endIdx] = await fetchNextPage();
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    setStreetcodes((prevState) => {
                        // replace empty objects to fetched streetcodes
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
                                            <SlickSlider {...props}>
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
