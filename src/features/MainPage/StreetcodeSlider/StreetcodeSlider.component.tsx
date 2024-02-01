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
        try {
            const response = await StreetcodesApi.getAllMainPage();
            setStreetcodes(response);

            const newImages : Image[] = [];
            for (const streetcode of response) {
                await ImagesApi.getById(streetcode.imageId)
                    .then((img) => newImages.push(img));
            }
            setImages(newImages);
        } catch (error) {
            console.log(error);
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
