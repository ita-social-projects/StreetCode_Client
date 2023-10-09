import './NewsSliderItem.styles.scss';

import { useMediaQuery } from 'react-responsive';
import htmlReactParser from 'html-react-parser';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { toArticleRedirectClickEvent } from '@/app/common/utils/googleAnalytics.unility';
import Image from '@/models/media/image.model';
import News from '@/models/news/news.model';

interface Props {
    news: News;
    image: Image
}

const NewsSliderItem = ({ news, image }: Props) => {

    const handleClickRedirect = () => {
        toArticleRedirectClickEvent(news.url.toString(), 'main_page');
        window.location.href = `news/${news.url.toString()}`;
    };
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        handleClickRedirect();
    };

    const tempElement = document.createElement('div');
    tempElement.innerHTML = news?.text;

    const strongElements = tempElement.querySelectorAll('strong');

    strongElements.forEach((strongElement) => {
        const parent = strongElement.parentNode;
        while (strongElement.firstChild) {
            parent.insertBefore(strongElement.firstChild, strongElement);
        }
        parent.removeChild(strongElement);
    });

    const cleanText = tempElement.innerHTML;

    return (
        <div className="newsSliderItem">
            <div className="newsMainPage">
                <div className="newsPageImgContainer">
                    <img
                        key={image?.id}
                        src={base64ToUrl(image?.base64, image?.mimeType)}
                        className="newsPageImg"
                    />
                </div>
                <div className="newsSlideText">
                    <div className="newsContainer">
                        <div className="subContainer">
                            <h2 className="newsTitle">
                                {news?.title}
                            </h2>
                            <div className="newsText">
                                <p className="text">
                                    {htmlReactParser(cleanText?.substring(0, 800))}
                                </p>
                                <a className="moreText" href={`news/${news.url.toString()}`} onClick={handleLinkClick}>
                                    До новини
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsSliderItem;
