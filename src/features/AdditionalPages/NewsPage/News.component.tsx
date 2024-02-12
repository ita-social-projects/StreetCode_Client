/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable max-len */
import './News.styles.scss';

import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NewsWithUrl } from '@models/news/news.model';
import { clearWindowHistoryState } from '@utils/window.utility';
import dayjs from 'dayjs';
import parse from 'html-react-parser';

import NewsApi from '@/app/api/news/news.api';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import useScrollToTop from '@/app/common/hooks/scrolling/useScrollToTop.hook';
import { useRouteUrl } from '@/app/common/hooks/stateful/useRouter.hook';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import {
    nextArticleClickEvent,
    prevArticleClickEvent, toArticleRedirectClickEvent,
} from '@/app/common/utils/googleAnalytics.unility';
// eslint-disable-next-line import/extensions
import useMobx from '@/app/stores/root-store';

import BreadCrumbForNews from './BreadCrumbForNews/BreadCrumbForNews.component';
import RandomNewsBlock from './RandomNewsBlock.component';

const NewsPage = () => {
    const newsUrl = useRouteUrl();
    const navigate = useNavigate();
    const location = useLocation();
    const [newsImg, setNewsImg] = useState<HTMLImageElement | null>(null);
    const [newsValue, setValue] = useState<NewsWithUrl>();
    const { imagesStore } = useMobx();
    const [parsedNewsText, setParsedNewsText] = useState<string>('');
    const [paragraphsCount, setParCount] = useState<number>(0);
    const [width, setWidth] = useState(0);
    const windowSize = useWindowSize();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [wrapperWidth, setWrapperWidth] = useState<number>(0);
    const { getImage, addImage } = imagesStore;

    useEffect(() => {
        const fromPage = location.state?.fromPage;

        if (fromPage) {
            toArticleRedirectClickEvent(newsUrl, fromPage);
            clearWindowHistoryState();
        }
    }, []);

    useEffect(() => {
        NewsApi.getNewsAndLinksByUrl(newsUrl)
            .then((res) => {
                setValue(res);
                const value = res as NewsWithUrl;
                setParsedNewsText(parse(value.news.text ?? '') as string);
                setParCount(((value.news.text as string)?.match(/<p\b[^>]*>/gi) || []).length);
            }).catch(() => {
                navigate(`${FRONTEND_ROUTES.OTHER_PAGES.ERROR404}`);
            });
    }, [newsUrl]);

    useScrollToTop();

    useEffect(
        () => {
            if (wrapperRef.current) {
                setWrapperWidth(wrapperRef.current.offsetWidth);
            }
        },
        [windowSize],
    );
    useEffect(
        () => {
            if (newsValue) {
                if (newsValue.news.imageId != null) {
                    addImage(newsValue.news.image!);
                    const newsimg = new Image();
                    if (newsValue.news.image) {
                        const imgUrl = base64ToUrl(getImage(newsValue.news.imageId!)?.base64, getImage(newsValue.news.imageId!)?.mimeType);
                        newsimg.src = imgUrl!;
                        newsimg.onload = function () {
                            setWidth(newsimg.width);
                            setNewsImg(newsimg);
                        };
                    }
                } else {
                    setNewsImg(null);
                }
            }
        },
        [newsValue?.news.imageId],
    );

    return (
        newsValue
            ? (
                <div className="newsContainer">
                    <div className="wrapper" ref={wrapperRef}>
                        <BreadCrumbForNews separator={<div className="separator" />} news={newsValue?.news} />
                        <div className="NewsHeader">
                            <h1 className="">{newsValue?.news.title}</h1>
                            <h3 className="news-date">{dayjs(newsValue?.news.creationDate).format('DD.MM.YYYY')}</h3>
                        </div>
                        <div className="newsWithImageWrapper">
                            {newsImg != null && (windowSize.width > 1024) ? (
                                <img
                                    className="newsImage"
                                    key={newsValue?.news.id}
                                    src={base64ToUrl(getImage(newsValue?.news.imageId!)?.base64, getImage(newsValue?.news.imageId!)?.mimeType)}
                                    alt={newsValue?.news.title}
                                />
                            ) : ''}
                            <div className="newsTextArea">
                                {paragraphsCount >= 2 ? parsedNewsText.slice(0, 3) : parsedNewsText}
                            </div>
                            {newsImg != null && (windowSize.width <= 1024) && (width >= wrapperWidth * 0.6) ? (
                                <img
                                    className="newsGoodImageClass Full"
                                    key={newsValue?.news.id}
                                    src={base64ToUrl(getImage(newsValue?.news.imageId!)?.base64, getImage(newsValue?.news.imageId!)?.mimeType)}
                                    alt={newsValue?.news.title}
                                />
                            ) : ''}
                            <div className="newsTextArea">
                                {paragraphsCount >= 2 ? parsedNewsText.slice(3) : ''}
                            </div>
                        </div>
                        <div className="newsLinks">
                            <Link
                                className={`Link ${newsValue?.prevNewsUrl === null ? 'toHide' : ''}`}
                                to={`/news/${newsValue?.prevNewsUrl}`}
                                onClick={prevArticleClickEvent}
                            >
                                    Попередня новина
                            </Link>
                            <Link
                                className={`Link ${newsValue?.nextNewsUrl === null ? 'toHide' : ''}`}
                                to={`/news/${newsValue?.nextNewsUrl}`}
                                onClick={nextArticleClickEvent}
                            >
                                    Наступна новина
                            </Link>
                        </div>
                        <RandomNewsBlock newsValue={newsValue} />
                    </div>
                </div>
            )
            : <></>
    );
};

export default NewsPage;
