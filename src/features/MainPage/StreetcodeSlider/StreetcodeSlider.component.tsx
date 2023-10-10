import './StreetcodeSlider.styles.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import ImagesApi from '@api/media/images.api';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Image from '@models/media/image.model';

import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import { StreetcodeMainPage } from '@/models/streetcode/streetcode-types.model';

import SlickSlider from '../../SlickSlider/SlickSlider.component';

import StreetcodeSliderItem from './StreetcodeSliderItem/StreetcodeSliderItem.component';
import useMobx from '@/app/stores/root-store';

const StreetcodeSlider = () => {
    const { streetcodeMainPageStore } = useMobx();
    const { fetchNextPageOfStreetcodesMainPage } = streetcodeMainPageStore;
    const [streetcodes, setStreetcodes] = useState<StreetcodeMainPage[]>([]);
    const [images, setImages] = useState<Image[]>([]);

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
        const newStreetcodes: StreetcodeMainPage[] = [];
        const newImages: Image[] = [];
        while (true) {
            try {
                const response = await fetchNextPageOfStreetcodesMainPage();
                newStreetcodes.push(...response);
                setStreetcodes(newStreetcodes);
                for (const streetcode of response) {
                    await ImagesApi.getById(streetcode.imageId)
                        .then((img) => {
                            newImages.push(img);
                        });
                }
                setImages(newImages);
            } catch (error: unknown) {
                break;
            }
        }
    });

    if (streetcodes.length > 0) {
        return (
            <div>
                <div className="streetcodeMainPageWrapper">
                    <div id="streetcodeSliderContentBlock" className="streetcodeSliderComponent">
                        <div className="streetcodeSliderContainer">
                            <div className="blockCenter">
                                <div className="streetcodeSliderContent">
                                    <SlickSlider {...props}>
                                        {streetcodes.map((item, index) => (
                                            <div key={item.id} className="slider-item">
                                                <StreetcodeSliderItem streetcode={item} image={images[index]} />
                                            </div>
                                        ))}
                                    </SlickSlider>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default observer(StreetcodeSlider);
