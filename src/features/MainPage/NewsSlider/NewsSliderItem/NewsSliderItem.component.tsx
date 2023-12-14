import './NewsSliderItem.styles.scss';

import { useMediaQuery } from 'react-responsive';
import CardText from '@components/CardText/CardText.component';
import dayjs from 'dayjs';
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
    const isMobileOrTablet = useMediaQuery({
        query: '(max-width: 1024px)',
    });

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
            <div className="newsMainPage" onClick={isMobileOrTablet ? handleClickRedirect : undefined}>
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
                            <CardText
                                onBtnClick={handleLinkClick}
                                moreBtnText="До новини"
                                title={news?.title}
                                text={htmlReactParser(cleanText?.substring(0, 800))}
                                subTitle={dayjs(news.creationDate).format('DD.MM.YYYY') ?? ''}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsSliderItem;
