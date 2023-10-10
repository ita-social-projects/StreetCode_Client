import './NewsSlider.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import ImagesApi from '@api/media/images.api';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Image from '@models/media/image.model';
import useMobx from '@stores/root-store';
import { toArticleRedirectClickEvent } from '@utils/googleAnalytics.unility';

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

    const [coordinatesOnMouseDown, setCoordinatesOnMouseDown] = useState([0, 0]);
    const [coordinatesOnMouseUp, setCoordinatesOnMouseUp] = useState([0, 0]);
    const [clickedNewsUrl, setClickedNewsUrl] = useState();

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

    const handleClickRedirect = (url : string) => {
        if (coordinatesOnMouseDown[0] === coordinatesOnMouseUp[0]
            && coordinatesOnMouseDown[1] === coordinatesOnMouseUp[1]) {
            toArticleRedirectClickEvent(url, 'main_page');
            window.location.href = `news/${url}`;
        }
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

    useEffect(() => {
        if (clickedNewsUrl !== undefined) {
            handleClickRedirect(clickedNewsUrl);
        }
    }, [coordinatesOnMouseUp]);

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
                                        <SlickSlider
                                            {...props}
                                        >
                                            {news.map((item, index) => (
                                                <div
                                                    key={item.id}
                                                    className="slider-item"
                                                    onMouseDown={(e) => {
                                                        setCoordinatesOnMouseDown([e.screenX, e.screenY]);
                                                    }}
                                                    onMouseUp={(e) => {
                                                        setCoordinatesOnMouseUp([e.screenX, e.screenY]);
                                                        setClickedNewsUrl(item.url.toString());
                                                    }}
                                                >
                                                    <NewsSliderItem news={item} image={images[index]} />
                                                </div>
                                            ))}
                                        </SlickSlider>
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
