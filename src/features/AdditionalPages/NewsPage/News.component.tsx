import './News.styles.scss';

import Footer from '@layout/footer/Footer.component';

import DonateBtnRectangle from './ModalButtons/DonateBtn/DonateBtnRectangle.component';
import PartnersBtn from './ModalButtons/PartnersBtn/PartnersBtn.component';
import PartnersBtnCircle from './ModalButtons/PartnersBtnCircle/PartnersBtnCircle.component';
import PartnersBlock from './PartnersBlock/PartnersBlock.component';
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
    console.log(newsStore.getNewsArray);
    const newsArr = newsStore.getNewsArray as News[];
    //console.log(newsArr.indexOf(news),'абв');
    newsArr.forEach((record)=> {
        console.log(record.id);
        console.log('абв')
    })
    console.log(newsArr.indexOf(value as News));
    // const getNewsArrId () => {

    // }
    value = useAsync(() => NewsApi.getById(id+1), [id]);
    const nextNews = value as News;
    value = useAsync(() => NewsApi.getById(id-1), [id]);
    const prevNews = value as News;
    //const id = news?.id;
    // const { newspres } = useAsync(() => NewsApi.getById(id), [id]);
    // const { pvalue } = useAsync(() => NewsApi.getByUrl(newsUrl), [newsUrl]);
    // const nnews = nvalue as News;
    console.log(news);
    console.log(123);
    console.log(value);
    const paragraphs = news?.text.split('\n');
    const { fetchImage, getImage } = imagesStore;

    useAsync(
        () => fetchImage(news?.imageId!),
        [news?.imageId],
    );
    const NewsId = newsStore.currentNews;

    console.log(nextNews, prevNews, "qsdfvgbnmk");
    // var prevNews = news;
    // var nextNews = news;
    // const getNews = (id: number) => {
    //     try {
    //         if(id>1)
    //         {
                
    //             prevNews = NewsApi.getById(id-1);
    //             nextNews = NewsApi.getById(id+1);
    //         }
    //         else{
    //             nextNews = NewsApi.getById(id+1);
    //         }
    //     } catch (error: unknown) {
    //         console.log(error);
    //     }
    // };


    
    // const createPartnersItem = (partners: Partner[]) => partners.map((partner) => (
    //     <PartnersItem partner={partner} />
    // ));
    // const [keyPartners, otherPartners] = getPartnerArray.reduce(
    //     (acc: [Partner[], Partner[]], partner: Partner) => {
    //         acc[partner.isKeyPartner ? 0 : 1].push(partner);
    //         return acc;
    //     },
    //     [[], []] as [Partner[], Partner[]],
    // );
 
    // useEffect(() => {
    //     const fetchNews = async () => {
    //       try {
    //         const response = await axios.get(`newsApi.GetByUrl(${id})`);
    //         const news = response.data;
    
    //         // Отримання попередньої та наступної новини
    //         const prevNews = await axios.get(`newsApi.GetPreviousNews(${news.id})`);
    //         const nextNews = await axios.get(`newsApi.GetNextNews(${news.id})`);
    
    //         setPrevNewsId(prevNews.data.id);
    //         setNextNewsId(nextNews.data.id);
    //       } catch (error) {
    //         console.error('Помилка при отриманні даних новини', error);
    //       }
    //     };
    
    //     fetchNews();
    //   }, [id]);

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
                { 
                /*<PartnersBlock /> */}
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
                {/* <Link className='Link' to="/news/ghjklccc">Попередня новина</Link>
                <Link className='Link' to="/news/streetcode-was-updated">Наступна новина</Link> */}
                <Link className='Link' to={`/news/${prevNews?.url}`}>Попередня новина</Link>
                <Link className='Link' to={`/news/${nextNews?.url}`}>Наступна новина</Link>
                <Link className='Link' to={`/news/${nextNews?.url}`}>Наступна новина</Link>
               
                </div>
                <div className="RandomNewsLink">
                    Також читайте:
                </div>
                
                {/* <div className="newsTextArea">{news?.text}</div> */}
                {/* <div className="subTitle titleBottom">
                
                
                </div> */}
                {/* <div className="buttonsContainer">
                    <div className="buttonsBlock">
                        <PartnersBtn />
                        <DonateBtnRectangle />
                    </div>
                </div>
                <PartnersBtnCircle /> */}

            </div>
        </div>
        <Footer />
    </div>
);
}

export default NewsPage;
