import './News.styles.scss';

import Footer from '@layout/footer/Footer.component';

import Title from './Title/Title.component';
import { useRouteUrl } from '@/app/common/hooks/stateful/useRouter.hook';
import useMobx from '@/app/stores/root-store';
import React, {useEffect,useState} from 'react';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import NewsApi from '@/app/api/news/news.api';
import News from '@/models/news/news.model';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Paragraph from 'antd/es/skeleton/Paragraph';
import { Link } from 'react-router-dom';

const NewsPage = () => {
    const newsUrl = useRouteUrl();
    const {newsStore, imagesStore} = useMobx();
    const { setCurrentNewsId } = newsStore;
    console.log(newsUrl);
    var { value } = useAsync(() => NewsApi.getByUrl(newsUrl), [newsUrl]);
    const news = value as News;
    const id = news?.id;
    const newsArr = newsStore.getNewsArray as News[];
   
    const paragraphs = news?.text.split('\n');
    const { fetchImage, getImage } = imagesStore;

    useAsync(
        () => fetchImage(news?.imageId!),
        [news?.imageId],
    );
    const NewsId = newsStore.currentNews;

    useEffect(() => {
        setCurrentNewsId(newsUrl).then();
    }, [setCurrentNewsId, newsUrl]);

    return(<div>
        <div className="partnersContainer">
            <div className="wrapper">
                <Title />
                <h1>{news?.title}</h1>
                <div className="newsTextArea">
                    {paragraphs?.slice(0, 3).map((paragraph, index) =>
                    (
                        <p key={index}>
                            {paragraph}
                            <br />
                        </p>
                    ))}
                    
                </div>
                <img
                    key={news?.id}
                    src={base64ToUrl(getImage(news?.imageId!)?.base64, getImage(news?.imageId!)?.mimeType)}
                    alt={news?.title}
                />
                <div className="newsTextArea">
                    {paragraphs?.slice(3).map((paragraph, index) =>
                    (
                        <p key={index}>
                            {paragraph}
                            <br />
                        </p>
                    ))}
                </div>
                <div className="NewsLinks">
                <Link className='Link' to="/news/ghjklccc">Попередня новина</Link>
                <Link className='Link' to="/news/streetcode-was-updated">Наступна новина</Link>
                </div>
                <div className="RandomNewsLink">
                    Також читайте:
                </div>
            </div>
        </div>
        <Footer />
    </div>
);
}

export default NewsPage;

