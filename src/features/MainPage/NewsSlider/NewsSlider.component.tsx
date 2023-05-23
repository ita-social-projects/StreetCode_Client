import './NewsSlider.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import useMobx from '@stores/root-store';
import SlickSlider from '../../SlickSlider/SlickSlider.component';
import News from '@/models/news/news.model';
import NewsApi from '@/app/api/news/news.api';
import NewsSliderItem from './NewsSliderItem/NewsSliderItem.component';
import Heading from '../Heading/Heading.component';

const NewsSlider = () => {
    const { streetcodeMainPageStore, newsStore } = useMobx();
    const {fetchNewsAll } = newsStore;
    const [news, setNews] = useState<News[]>([]);
   

    useEffect(() => {
        const fetchNewsAll = async () => {
            try {
                const response = await NewsApi.getAll();
                setNews(response);
                console.log(response);
            } catch (error) {
            }
        };
        fetchNewsAll();
    }, []);



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
        centerMode: true,
      
    };

    const handleClick = () => {
        window.location.assign('https://www.instagram.com/streetcodeua/');
    }
   
        return (
            <div>
                <div className="NewsWrapper">
                <Heading blockName='Новини' buttonName='Всі новини' setActionOnClick={handleClick}/>
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
        );
    

};

export default observer(NewsSlider);