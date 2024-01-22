import './NewsSliderItem.styles.scss';

import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import CardText from '@components/CardText/CardText.component';
import dayjs from 'dayjs';
import htmlReactParser from 'html-react-parser';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
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

    const navigate = useNavigate();
    const historyState = { fromPage: 'main_page' };
    const handleClickRedirect = () => navigate(news.url.toString(), { state: historyState });

    const tempElement = document.createElement('div');
    tempElement.innerHTML = news?.text;

    const strongElements = tempElement.querySelectorAll('strong');

    strongElements.forEach((strongElement) => {
        const parent = strongElement.parentNode as ParentNode;
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
                        alt="news"
                    />
                </div>
                <div className="newsSlideText">
                    <div className="newsContainer">
                        <div className="subContainer">
                            <CardText
                                moreBtnAsLink={{ link: news.url.toString(), state: historyState }}
                                moreBtnText="До новини"
                                title={news?.title}
                                text={htmlReactParser(cleanText?.substring(0, 800)) as string}
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
