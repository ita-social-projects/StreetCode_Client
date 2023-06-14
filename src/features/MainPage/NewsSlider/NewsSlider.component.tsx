import './NewsSlider.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import useMobx from '@stores/root-store';

import NewsApi from '@/app/api/news/news.api';
import News from '@/models/news/news.model';

import SlickSlider from '../../SlickSlider/SlickSlider.component';
import Heading from '../Heading/Heading.component';

import NewsSliderItem from './NewsSliderItem/NewsSliderItem.component';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';

const NewsSlider = () => {
    const { streetcodeMainPageStore, newsStore } = useMobx();
    const { fetchNewsAll } = newsStore;
    const [news, setNews] = useState<News[]>([]);

    useEffect(() => {
        const fetchNewsAll = async () => {
            try {
                const response = await NewsApi.getAllSortedNews();
                setNews(response);
            } catch (error) {
            }
        };
        fetchNewsAll();
    }, []);

    const windowSize = useWindowSize();

    const props = {

        touchAction: 'pan-y',
        touchThreshold: 25,
        transform: 'translateZ(0)',
        arrows: false,
        dots:windowSize.width < 1024,
        infinite: true,
        variableWidth: true,
        slidesToShow: 1,

        swipeOnClick: false,
        centerMode: true,

    };

    const handleClick = () => {
        window.location.assign('https://www.instagram.com/streetcodeua/');
    };

    return (
        (news.length > 0)
            ? (
                <div>
                    <div className="NewsWrapper">
                        <Heading blockName="Новини" buttonName="Всі новини" setActionOnClick={handleClick} />
                        <div id="newsSliderContentBlock" className="newsSliderComponent">
                            <div className="newsSliderContainer">
                                <div className="blockCentering">
                                    <div className="newsSliderContent">
                                        <SlickSlider {...props}>
                                            {news.map((item) => (
                                                <div key={item.id} className="slider-item">
                                                    <NewsSliderItem news={item} />
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
