import './News.styles.scss';

import { useRouteUrl } from '@/app/common/hooks/stateful/useRouter.hook';
import useMobx from '@/app/stores/root-store';
import React, { useEffect, useRef, useState } from 'react';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import NewsApi from '@/app/api/news/news.api';
import News from '@/models/news/news.model';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { Link } from 'react-router-dom';
import BreadCrumbForNews from './BreadCrumbForNews/BreadCrumbForNews.component';
import parse from 'html-react-parser';
import { NewsWithUrl, RandomNews } from '@models/news/news.model';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import { alsoReadArticleClickEvent, nextArticleClickEvent, prevArticleClickEvent } from '@/app/common/utils/googleAnalytics.unility';

const NewsPage = () => {
    const newsUrl = useRouteUrl();
    const [newsImg, setNewsImg] = useState<HTMLImageElement | null>(null);
    const [newsValue, setValue] = useState<NewsWithUrl>();
    const { imagesStore } = useMobx();
    const [parsedNewsText, setParsedNewsText] = useState<string>("");
    const [paragraphsCount, setParCount] = useState<number>(0);
    const [width, setWidth] = useState(0);
    const windowSize = useWindowSize();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [wrapperWidth, setWrapperWidth] = useState<number>(0);
    const { getImage, addImage } = imagesStore;

    useEffect(
        () => {
            NewsApi.getNewsAndLinksByUrl(newsUrl)
            .then(res => {
                setValue(res)
                const value = res as NewsWithUrl;
                setParsedNewsText(parse(value.news.text ?? "") as string);
                setParCount(((value.news.text as string)?.match(/<p\b[^>]*>/gi) || []).length);
            });            
        }, [newsUrl]);

    useEffect(
        () => {
            window.scrollTo(0, 0);
        },
        [newsValue?.news.url],
    );
    
    useEffect(
        () => {
            if(wrapperRef.current) {
                setWrapperWidth(wrapperRef.current.offsetWidth)
            }
        },
        [windowSize]
    )
    useEffect(
        () => {
            if(newsValue)
            {
                if (newsValue.news.imageId != null) {
                    addImage(newsValue.news.image!);
                    var newsimg = new Image;
                    if (newsValue.news.image) {
                        const imgUrl = base64ToUrl(getImage(newsValue.news.imageId!)?.base64, getImage(newsValue.news.imageId!)?.mimeType);
                        newsimg.src = imgUrl!;
                        newsimg.onload = function () {
                            setWidth(newsimg.width);
                            setNewsImg(newsimg);
                        }
                    }        
                }
                else {
                    setNewsImg(null);
                }
            }
        },
        [newsValue?.news.imageId],
    );
    
    return (<div>
        <div className="newsContainer">
            <div className="wrapper" ref={wrapperRef}>
                <BreadCrumbForNews separator={<div className="separator" />} news={newsValue?.news} />
                <div className='NewsHeader'>
                    <h1 className=''>{newsValue?.news.title}</h1>
                </div>
                <div className={`newsWithImageWrapper`}>
                    {newsImg != null && (windowSize.width >= 1024) && (width < wrapperWidth * 0.6) ? (  
                        <img
                            className={"newsImage"}
                            key={newsValue?.news.id}
                            src={base64ToUrl(getImage(newsValue?.news.imageId!)?.base64, getImage(newsValue?.news.imageId!)?.mimeType)}
                            alt={newsValue?.news.title}
                        />
                    ): ""}
                    {newsImg != null && (windowSize.width < 1024) && (width < wrapperWidth * 0.6) ? (  
                        <img
                            className={"newsImage"}
                            key={newsValue?.news.id}
                            src={base64ToUrl(getImage(newsValue?.news.imageId!)?.base64, getImage(newsValue?.news.imageId!)?.mimeType)}
                            alt={newsValue?.news.title}
                        />
                    ): ""}
                    <div className="newsTextArea">
                        {paragraphsCount >= 2 ? parsedNewsText.slice(0, 3) : parsedNewsText}
                    </div>
                    {newsImg != null && (windowSize.width <= 1024) && (width >= wrapperWidth * 0.6) ? (  
                        <img
                            className={"newsGoodImageClass Full"}
                            key={newsValue?.news.id}
                            src={base64ToUrl(getImage(newsValue?.news.imageId!)?.base64, getImage(newsValue?.news.imageId!)?.mimeType)}
                            alt={newsValue?.news.title}
                        />
                    ): ""}
                    {newsImg != null && (windowSize.width > 1024) && (width >= wrapperWidth * 0.6) ? (  
                        <img
                            className={"newsGoodImageClass Full"}
                            key={newsValue?.news.id}
                            src={base64ToUrl(getImage(newsValue?.news.imageId!)?.base64, getImage(newsValue?.news.imageId!)?.mimeType)}
                            alt={newsValue?.news.title}
                        />
                    ): ""}
                    <div className="newsTextArea">
                    {paragraphsCount >= 2 ? parsedNewsText.slice(3) : ""}
                    </div>
                </div>
                <div className="newsLinks">
                    <Link className={`Link ${newsValue?.prevNewsUrl === null ? 'toHide' : ''}`}
                        to={`/news/${newsValue?.prevNewsUrl}`}
                        onClick={prevArticleClickEvent}>
                        Попередня новина
                    </Link>
                    <Link className={`Link ${newsValue?.nextNewsUrl === null ? 'toHide' : ''}`}
                        to={`/news/${newsValue?.nextNewsUrl}`}
                        onClick={nextArticleClickEvent}>
                        Наступна новина
                    </Link>
                </div>
                <div className={`randomNewsBlock ${newsValue?.news.url as unknown as string === newsValue?.randomNews.randomNewsUrl ? 'toHide' : ''}`}>
                    <div className="randomNewsLink">
                        <div className="additionalNewsText">
                            Також читайте:
                        </div>
                        <div className="randomNewsTitleAndButtn">
                            {newsValue?.randomNews.title}
                            <div className="newsButtonContainer">
                                <Link className={`Link ${newsValue?.news.url as unknown as string === newsValue?.randomNews.randomNewsUrl ? 'toHide' : ''}`} 
                                to={`/news/${newsValue?.randomNews.randomNewsUrl}`} 
                                onClick={alsoReadArticleClickEvent}>
                                    <button>Перейти</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default NewsPage;