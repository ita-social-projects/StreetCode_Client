import './NewsSlider.styles.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import ImagesApi from '@api/media/images.api';
import StreetcodesApi from '@api/streetcode/streetcodes.api';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Image from '@models/media/image.model';
import useMobx from '@stores/root-store';

import NewsApi from '@/app/api/news/news.api';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import News from '@/models/news/news.model';

import SlickSlider from '../../SlickSlider/SlickSlider.component';
import Heading from '../Heading/Heading.component';

import NewsSliderItem from './NewsSliderItem/NewsSliderItem.component';

const NewsSlider = () => {
    const { streetcodeMainPageStore, newsStore } = useMobx();
    const { fetchNewsAll } = newsStore;
    const [news, setNews] = useState<News[]>([]);
    const [images, setImages] = useState<Image[]>([]);

    const windowSize = useWindowSize();

    const props = {

        touchAction: 'pan-y',
        touchThreshold: 25,
        transform: 'translateZ(0)',
        arrows: false,
        dots: windowSize.width < 1024,
        infinite: true,
        variableWidth: true,
        slidesToShow: 1,

        swipeOnClick: false,
        centerMode: true,

    };

    useAsync(async () => {
        try {
            const response = await NewsApi.getAllSortedNews();
            setNews(response);

            const newImages : Image[] = [];
            for (const newsInfo of response) {
                if (newsInfo.imageId != null) {
                    await ImagesApi.getById(newsInfo.imageId)
                        .then((img) => {
                            newImages.push(img);
                            setImages(newImages);
                        });
                }
            }
        } catch (error) {}
    });

    return (
        (news.length > 0)
            ? (
                <div>
                    <div className="NewsWrapper">
                        <Heading blockName="Новини" buttonName={undefined} setActionOnClick={undefined} />
                        <div id="newsSliderContentBlock" className="newsSliderComponent">
                            <div className="newsSliderContainer">
                                <div className="blockCentering">
                                    <div className="newsSliderContent">
                                        {(news.length === 1) ? (
                                            <div key={news[0].id} className="slider-item">
                                                <NewsSliderItem news={news[0]} image={images[0]} />
                                            </div>
                                        ) : (
                                        <SlickSlider {...props}>
                                            {news.map((item, index) => (
                                                <div key={item.id} className="slider-item">
                                                    <NewsSliderItem news={item} image={images[index]} />
                                                </div>
                                            ))}
                                        </SlickSlider>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : <></>
    );
};

export default observer(NewsSlider);
