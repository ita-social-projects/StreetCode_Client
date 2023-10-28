import './StreetcodeSlider.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import ImagesApi from '@api/media/images.api';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Image from '@models/media/image.model';

import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import { paginateRequest } from '@/app/common/utils/paginateRequest';
import { StreetcodeMainPage } from '@/models/streetcode/streetcode-types.model';

import SlickSlider from '../../SlickSlider/SlickSlider.component';

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
        centerPadding: '-5px',
    };

    const windowsize = useWindowSize();
    if (windowsize.width <= 1024 && windowsize.width >= 768) props.centerMode = true;
    if (windowsize.width <= 1024) props.dots = true;

    useAsync(async () => {
        const shuffleSeed = Math.floor(Date.now() / 1000);
        const { fetchNextPage } = paginateRequest(3, StreetcodesApi.getPageMainPage, { shuffleSeed });

        if (!loading.current) {
            loading.current = true;
            while (true) {
                try {
                    const newStreetcodes = await fetchNextPage();
                    setStreetcodes((prevState) => [...prevState, ...newStreetcodes]);

                    const newImages: Image[] = [];
                    const pomises = [];

                    for (let i = 0; i < newStreetcodes.length; i++) {
                        const currentPosition = newImages.length + i;
                        pomises.push(ImagesApi.getById(newStreetcodes[i].imageId).then((img) => {
                            newImages[currentPosition] = img;
                        }));
                    }

                    await Promise.all(pomises).then(() => {
                        setImages((prevState) => [...prevState, ...newImages]);
                    });
                    console.log(streetcodes);
                    console.log(images);

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
                                                {streetcodes.map((item) => (
                                                    <div key={item.id} className="slider-item">
                                                        <StreetcodeSliderItem
                                                            streetcode={item}
                                                            image={images.find((i) => i.id === item.imageId)}
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
