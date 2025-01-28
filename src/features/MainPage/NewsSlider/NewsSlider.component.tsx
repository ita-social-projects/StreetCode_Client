import './NewsSlider.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import Heading from '@features/MainPage/Heading/Heading.component';
import NEWS_SLIDER_PROPS from '@features/MainPage/NewsSlider/constants/newsSliderProps.constant';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import useMobx, { useModalContext } from '@stores/root-store';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';

import NewsSliderItem from './NewsSliderItem/NewsSliderItem.component';
import { useQuery } from '@tanstack/react-query';

const NewsSlider = () => {
    const windowSize = useWindowSize();

    const { modalStore } = useModalContext();
    const { imagesStore, newsStore } = useMobx();

    useQuery({
        queryKey: ['news', newsStore.CurrentPage],
        queryFn: () => newsStore.getAllPublished(10),
    });

    imagesStore.fetchImages(newsStore.NewsArray || []);

    const [dragging, setDragging] = useState(false);

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
        (newsStore.NewsArray && newsStore.NewsArray.length > 0)
            ? (
                <div>
                    <div className="NewsWrapper">
                        <Heading blockName="Новини" buttonName={undefined} setActionOnClick={undefined} />
                        <div id="newsSliderContentBlock" className="newsSliderComponent">
                            <div className="newsSliderContainer">
                                <div className="blockCentering">
                                    <div className="newsSliderContent">
                                        {(newsStore.NewsArray.length === 1) ? (
                                            <div
                                                key={newsStore.NewsArray[0].id}
                                                className="slider-item"
                                                onClickCapture={handleOnItemClick}
                                            >
                                                <NewsSliderItem
                                                    news={newsStore.NewsArray[0]}
                                                    image={imagesStore.getImage(newsStore.NewsArray[0].imageId)}
                                                />
                                            </div>
                                        ) : (
                                            <SlickSlider
                                                secondPreset={true}
                                                beforeChange={handleBeforeChange}
                                                afterChange={handleAfterChange}
                                                dots={ windowSize.width <= 1024}
                                                arrows={ windowSize.width > 1024}
                                                {...NEWS_SLIDER_PROPS}
                                            >
                                                {newsStore.NewsArray.map((item, index) => (
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
