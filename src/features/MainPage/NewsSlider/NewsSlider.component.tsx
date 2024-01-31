import './NewsSlider.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import Heading from '@features/MainPage/Heading/Heading.component';
import NEWS_SLIDER_PROPS from '@features/MainPage/NewsSlider/constants/newsSliderProps.constant';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import useMobx, { useModalContext } from '@stores/root-store';


import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';

import NewsSliderItem from './NewsSliderItem/NewsSliderItem.component';

const NewsSlider = () => {
    const windowSize = useWindowSize();

    const { modalStore } = useModalContext();
    const { imagesStore, newsStore } = useMobx();

    newsStore.fetchSortedNews();
    imagesStore.fetchImages(newsStore.getNewsArray || []);

    const [dragging, setDragging] = useState(false);

    NEWS_SLIDER_PROPS.dots = windowSize.width < 1024;

    const handleBeforeChange = useCallback(() => {
        setDragging(true);
    }, [setDragging]);

    const handleAfterChange = useCallback(() => {
        setDragging(false);
    }, [setDragging]);

    const handleOnItemClick = useCallback(
        (e : React.MouseEvent<HTMLDivElement>) => {
            if (dragging) e.stopPropagation();
        },
        [dragging],
    );

    return (
        (newsStore.getNewsArray && newsStore.getNewsArray.length > 0)
            ? (
                <div>
                    <div className="NewsWrapper">
                        <Heading blockName="Новини" buttonName={undefined} setActionOnClick={undefined} />
                        <div id="newsSliderContentBlock" className="newsSliderComponent">
                            <div className="newsSliderContainer">
                                <div className="blockCentering">
                                    <div className="newsSliderContent">
                                        {(newsStore.getNewsArray.length === 1) ? (
                                            <div
                                                key={newsStore.getNewsArray[0].id}
                                                className="slider-item"
                                                onClickCapture={handleOnItemClick}
                                            >
                                                <NewsSliderItem
                                                    news={newsStore.getNewsArray[0]}
                                                    image={imagesStore.getImage(newsStore.getNewsArray[0].imageId)}
                                                />
                                            </div>
                                        ) : (
                                            <SlickSlider
                                                beforeChange={handleBeforeChange}
                                                afterChange={handleAfterChange}
                                                {...NEWS_SLIDER_PROPS}
                                            >
                                                {newsStore.getNewsArray.map((item, index) => (
                                                    <div
                                                        key={item.id}
                                                        className="slider-item"
                                                        onClickCapture={handleOnItemClick}
                                                    >
                                                        <NewsSliderItem
                                                            news={item}
                                                            image={imagesStore.getImage(item.imageId)}
                                                        />
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
