import { useEffect, useRef, useState } from 'react';
import useMobx from '@stores/root-store';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { StreetcodeCatalogRecord, StreetcodeMainPage } from '@/models/streetcode/streetcode-types.model';
import './NewsSliderItem.styles.scss';
import Image from '@/models/media/image.model';
import ImagesApi from '@/app/api/media/images.api';
import News from '@/models/news/news.model';


interface Props {
    news: News;
}



const NewsSliderItem = ({ news }: Props) => {
    const { imagesStore: { getImage, fetchImage } } = useMobx();
    const id = news?.id;
    const { imageLoaderStore, modalStore: { setModal } } = useMobx();
    const { handleImageLoad } = imageLoaderStore;
    const [image, setImage] = useState<Image>();

    useEffect(() => {
        if (id) {
            ImagesApi.getById(news.imageId)
                .then((imgs) => setImage(imgs))
                .catch((e) => { });
        }

    }, [news]);

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) {
            return text;
        }
        const truncatedText = text.substr(0, maxLength);
        return truncatedText.substr(0, truncatedText.lastIndexOf(' ')) + '...';
    };

    const newsText = truncateText(news?.text || '', 447);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.href = news.text;
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
                        onLoad={handleImageLoad}
                    />
                </div>
                <div className="newsSlideText">
                    <div className="newsContainer">
                        <div>
                            <h2 className="newsTitle">
                                {news?.title}
                            </h2>
                            <div className="newsText">
                                {newsText}
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