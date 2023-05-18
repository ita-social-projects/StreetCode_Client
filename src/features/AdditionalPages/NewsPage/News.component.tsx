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
import BreadCrumb from './BreadCrumb/BreadCrumb.component';
import { Url } from 'url';

const NewsPage = () => {
    const newsUrl = useRouteUrl();
    const {newsStore, imagesStore} = useMobx();
    const { setCurrentNewsId } = newsStore;
    console.log(newsUrl);
    var { value } = useAsync(() => NewsApi.getByUrl(newsUrl), [newsUrl]);
    const news = value as News;
    const id = news?.id;
    console.log(value);
    const newsArr = newsStore.getNewsArray as News[];
    console.log(newsArr.findIndex(x => x.id == news?.id),'абв');
    newsArr.forEach((record)=> {
        console.log(record.id);
        console.log('абв')
    })


    console.log(newsArr[0]);
    // const getNewsArrId () => {
    //console.log(news?.text)
    // }
    
    //const id = news?.id;
    // const { newspres } = useAsync(() => NewsApi.getById(id), [id]);
    // const { pvalue } = useAsync(() => NewsApi.getByUrl(newsUrl), [newsUrl]);
    // const nnews = nvalue as News;
    console.log(news);
    console.log(123);
    console.log(value);
    const paragraphs = news?.text.split('\n');
    const { fetchImage, getImage } = imagesStore;

    function getPreviousIndex(currentIndex: number) {
        if (currentIndex > 0) {
          return currentIndex - 1;
        }
        return -1;
      }
      
    function getNextIndex(arr: News[], currentIndex: number) {
        if (currentIndex < arr.length - 1) {
          return currentIndex + 1;
        }
        return -1;
      }
    const prevIndex = getPreviousIndex(newsArr.findIndex(x => x.id == news?.id));
    const nextIndex = getNextIndex(newsArr, newsArr.findIndex(x => x.id == news?.id));

    
    // console.log(nextIndex,prevIndex);
    // value = useAsync(() => NewsApi.getByUrl((newsArr[nextIndex]?.url as unknown as string)), [newsArr]);
    // const nextNews = value as News;
    // value = useAsync(() => NewsApi.getByUrl((newsArr[prevIndex]?.url as unknown as string)), [newsArr]);
    // const prevNews = value as News;
    // console.log(nextNews, prevNews, "qsdfvgbnmk");
    useAsync(
        () => fetchImage(news?.imageId!),
        [news?.imageId],
    );
    const NewsId = newsStore.currentNews;

    
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

    // useEffect(() => {
    //     setCurrentNewsId(newsUrl).then();
    // }, [setCurrentNewsId, newsUrl]);

    return(<div>
        <div className="newsContainer">
            <div className="wrapper">
                {/* <Title /> */}
                <BreadCrumb separator={<div className="separator" />} news={news} />
                <div className='NewsHeader'>
                <h1 className=''>{news?.title}</h1>
                </div>
                <div className="newsWithImageWrapper">
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
                    <img className="newsImage"
                        key={news?.id}
                        src={base64ToUrl(getImage(news?.imageId!)?.base64, getImage(news?.imageId!)?.mimeType)}
                        alt={news?.title}
                    />
                </div>
                
                <div className="newsTextArea">
                    {paragraphs?.slice(3).map((paragraph, index) =>
                    (
                        <p key={index}>
                            {paragraph}
                            <br />
                        </p>
                    ))}
                </div>
                <div className="newsLinks">
                <Link className='Link' to="/news/ghjklccc">Попередня новина</Link>
                <Link className='Link' to="/news/streetcode-was-updated">Наступна новина</Link>
                {/* <Link className='Link' to={`/news/${prevNews?.url}`}>Попередня новина</Link>
                <Link className='Link' to={`/news/${nextNews?.url}`}>Наступна новина</Link> */}
                {/* <Link className='Link' to={`/news/${nextNews?.url}`}>Наступна новина</Link> */}
               
                </div>
                <div className="randomNewsBlock">
                    <div className="randomNewsLink">
                        <div className="additionalNewsText">
                            Також читайте:
                        </div>
                        <div className="randomNewsTitleAndButtn">
                            {news?.title}   
                            <div className="newsButtonContainer">
                                <Link to="/news/ghjklccc">
                                    <button >Перейти</button>
                                </Link>
                            </div>
                        </div>
                    </div>
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
