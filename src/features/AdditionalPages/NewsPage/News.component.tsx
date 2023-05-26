import './News.styles.scss';

import Footer from '@layout/footer/Footer.component';

import { useRouteUrl } from '@/app/common/hooks/stateful/useRouter.hook';
import useMobx from '@/app/stores/root-store';
import React, { useEffect, useState } from 'react';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import NewsApi from '@/app/api/news/news.api';
import News from '@/models/news/news.model';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { Link } from 'react-router-dom';
import BreadCrumb from './BreadCrumb/BreadCrumb.component';
import parse from 'html-react-parser';

const NewsPage = () => {
    const newsUrl = useRouteUrl();
    const [newsImg, setNewsImg] = useState<HTMLElement>(); 
    const { newsStore, imagesStore } = useMobx();
    var { value } = useAsync(() => NewsApi.getByUrl(newsUrl), [newsUrl]);
    const news = value as News;
    const newsArr = newsStore.getNewsArray as News[];

    const newsIndex = newsArr.findIndex(x => x.id == news?.id);
    const parsedText = parse(news?.text ?? "");
    const [width, setWidth] = useState(0);
    const { fetchImage, getImage } = imagesStore;
    const [wrapperWidth, setWrapperWidth] = useState(0);
    const wrapperObj = document.querySelector('.wrapper') as HTMLElement;

    const getNewsElement = (newsArr: News[], ind: number) => {
        const arrLength = newsArr.length;
        if (arrLength > 3) {
          if ( newsArr[ind + 1] == newsArr[arrLength - 1] || newsArr[ind] == newsArr[arrLength - 1]) {
            return newsArr[ind - 2];
          }
          else {
            return newsArr[arrLength-1]
          }
        } else {
          return newsArr[ind];
        }
    }

    const getFullImg = () => {
        var newsimg = new Image;
        var strongTags = document.getElementsByTagName('strong');
        var lastStrongTag = strongTags[strongTags.length - 1]; 
        if(news.image){
            var imgUrl = base64ToUrl(getImage(news.imageId!)?.base64, getImage(news.imageId!)?.mimeType);
            newsimg.src = imgUrl!;

            newsimg.onload = function() {
                setWidth(newsimg.width);

                if (strongTags.length > 0 ) {
                    const img = document.createElement('img');
                    img.src = imgUrl!;
                    img.className = `newsGoodImageClass ${newsimg.width > wrapperWidth * 0.5 ? 'Full' : ''}`;
                    setNewsImg(img);

                    if (newsimg.width > wrapperWidth * 0.5 || wrapperWidth <= 600)
                    {
                        lastStrongTag.parentNode?.insertBefore(img, lastStrongTag.nextSibling);
                    }    
                }
            }      
        }     
        
    }

    const DellFullImg = () => {
        if(newsImg){
            var parentElement = newsImg.parentNode;
            parentElement?.removeChild(newsImg!);
        }
    };

    useAsync(
        () => {
        fetchImage(news.imageId!)
        .then(getFullImg);
        },
        [news?.imageId],
    );

    useEffect(
        () => {
        DellFullImg();
        window.scrollTo(0,0);
        },
        [news?.url],
    );

    useEffect(
        () => {
            newsStore.fetchNewsAll();
        },
        [],
    )

    useEffect(
        () => {setWrapperWidth(wrapperObj?.offsetWidth);},
        [wrapperObj]
    )

    return (<div>
        <div className="newsContainer">
            <div className="wrapper">
                <BreadCrumb separator={<div className="separator" />} news={news} />
                <div className='NewsHeader'>
                    <h1 className=''>{news?.title}</h1>
                </div>
                <div  className={`newsWithImageWrapper ${width > wrapperWidth * 0.5 ? 'Full' : ''}`}>
                <img className= {`newsImage ${width > wrapperWidth * 0.5 ? 'Full' : ''}`}
                        key={news?.id}
                        src={base64ToUrl(getImage(news?.imageId!)?.base64, getImage(news?.imageId!)?.mimeType)}
                        alt={news?.title}
                    />
                    <div className="newsTextArea">
                        {parsedText}
                    </div>
                </div>
                <div className="newsLinks">
                    <Link className={`Link ${typeof newsArr[newsIndex - 1]?.url === 'undefined' ? 'toHide' : ''}`} 
                    to={`/news/${newsArr[newsIndex - 1]?.url}`}>
                        Попередня новина
                    </Link>
                    <Link className={`Link ${typeof newsArr[newsIndex + 1]?.url === 'undefined' ? 'toHide' : ''}`} 
                    to={`/news/${newsArr[newsIndex + 1]?.url}`}>
                        Наступна новина
                    </Link>
                </div>
                <div className={`randomNewsBlock ${news?.url === getNewsElement(newsArr, newsIndex)?.url ? 'toHide' : ''}`}>
                    <div className="randomNewsLink">
                        <div className="additionalNewsText">
                            Також читайте:
                        </div>
                        <div className="randomNewsTitleAndButtn">
                            {getNewsElement(newsArr, newsIndex)?.title}
                            <div className="newsButtonContainer">
                                <Link className={`Link ${news?.url === getNewsElement(newsArr, newsIndex)?.url ? 'toHide' : ''}`} to={`/news/${getNewsElement(newsArr, newsIndex)?.url}`} >
                                    <button >Перейти</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* <Footer /> */}
    </div>
    );
}

export default NewsPage;
