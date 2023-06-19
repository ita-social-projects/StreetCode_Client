import { useEffect, useRef, useState } from 'react';
import useMobx from '@stores/root-store';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { StreetcodeCatalogRecord, StreetcodeMainPage } from '@/models/streetcode/streetcode-types.model';
import './NewsSliderItem.styles.scss';
import Image from '@/models/media/image.model';
import ImagesApi from '@/app/api/media/images.api';
import News from '@/models/news/news.model';
import htmlReactParser, { domToReact } from 'html-react-parser';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import { toArticleRedirectClickEvent } from '@/app/common/utils/googleAnalytics.unility';

interface Props {
    news: News;
}

const NewsSliderItem = ({ news }: Props) => {
    const id = news?.id;
    const [image, setImage] = useState<Image>();

    useEffect(() => {
        if (id) {
            ImagesApi.getById(news.imageId)
                .then((imgs) => setImage(imgs))
                .catch((e) => { });
        }
    }, [news]);

    const screenSize = useWindowSize();

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) {
            return text;
        }

        let truncatedText = text.substr(0, maxLength);

        if (news?.title.length < 41) {
            truncatedText = truncatedText.substr(0, 400);
        } else if (news?.title.length >= 40 && news?.title.length < 81) {
            truncatedText = truncatedText.substr(0, 250);
        } else {
            truncatedText = truncatedText.substr(0, 75);
        }

        if(screenSize.width<=649 && screenSize.width>768){
            truncatedText = truncatedText.substr(0, 200);
        }

        
        
        return truncatedText.substr(0, truncatedText.lastIndexOf(' ')) + '...';
    };

    const newsText = truncateText(news?.text || '', 400);

    const options: any = {
        replace: (domNode: { type: string; name: string; children: any; }) => {
          if (domNode.type === 'tag') {
            if (domNode.name === 'p') {
                return <span className="newsText">{domToReact(domNode.children, options)}</span>;
            } else if (domNode.name === 'strong') {
              return <span className="newsText">{domToReact(domNode.children, options)}</span>;
            }
          }
        },
      };
      

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        toArticleRedirectClickEvent(news.url.toString());
        window.location.href = news.url.toString();
    };


    return (
        <div className="newsSliderItem">
            <div className="newsMainPage">
                <div className="newsPageImgContainer">
                    <img
                        key={image?.id}
                        src={base64ToUrl(image?.base64, image?.mimeType)}
                        className="newsPageImg"
                        alt={image?.alt}
                    />
                </div>
                <div className="newsSlideText">
                    <div className="newsContainer">
                        <div>
                            <h2 className="newsTitle">
                                {news?.title}
                            </h2>
                            <div className="newsText">
                                {htmlReactParser(newsText, options)}
                                <a className="moreText" href={news.text} onClick={handleLinkClick}>
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
