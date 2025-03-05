/* eslint-disable max-len */
import './StreetcodeCatalogItem.styles.scss';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useMobx from '@stores/root-store';
import { useAudioContext, useModalContext, useStreetcodePageLoaderContext } from '@stores/root-store';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { toStreetcodeRedirectClickEvent } from '@/app/common/utils/googleAnalytics.unility';
import { StreetcodeCatalogRecord } from '@/models/streetcode/streetcode-types.model';
import Image, { ImageAssigment } from '@/models/media/image.model';
import ImagesApi from '@/app/api/media/images.api';
import TransactionLinksApi from '@/app/api/transactions/transactLinks.api';
import ImageStore from "@stores/image-store";

interface Props {
    streetcode: StreetcodeCatalogRecord;
    isLast: boolean;
    handleNextScreen: () => void;
}

const StreetcodeCatalogItem = ({ streetcode, isLast, handleNextScreen }: Props) => {
    const id = streetcode?.id;
    const { modalStore: { setModal } } = useModalContext();
    const streecodePageLoaderContext = useStreetcodePageLoaderContext();
    const { imagesStore } = useMobx();
    const [arlink, setArlink] = useState('');
    const [images, setImages] = useState<Image[]>();
    const [imagesForSlider, setImagesForSlider] = useState<Image>(); // Change type to Image
    const elementRef = useRef<HTMLDivElement>(null);
    const classSelector = 'catalogItem';
    const [linkStyle, setLinkStyle] = useState({}); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await imagesStore.fetchImageByStreetcodeId(id);
                const imgs = imagesStore.getImageArray;
                setImages(imgs);
                const relatedFigureImages = imgs.filter(
                    (image) => image.imageDetails?.alt === ImageAssigment.relatedfigure.toString()
                );
                const imagesForSlider = relatedFigureImages.length > 0 ? relatedFigureImages[0] : imgs.find(
                    (image) => image.imageDetails?.alt === ImageAssigment.blackandwhite.toString()
                );
                setImagesForSlider(imagesForSlider);
            } catch (error) {
                try {
                    const x = await TransactionLinksApi.getByStreetcodeId(id);
                    setArlink(x.url);
                } catch (error) {
                    console.error('Error fetching transaction links:', error);
                }
            }
        }
        if (id && id > 0) {
            fetchData();
        }
    }, [streetcode]);

    const LinkProps = {
        className: classSelector,
        style: {
            backgroundImage: `url(${base64ToUrl(imagesForSlider?.base64, imagesForSlider?.mimeType)})`
        },
        to: `../${streetcode.url}`,
    };

const windowsize = useWindowSize();

const handleClickRedirect = () => {
    toStreetcodeRedirectClickEvent(streetcode.url.toString(), 'catalog');
        navigate(`/${streetcode.url}`);
};
const handleTextClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleClickRedirect();
};

useEffect(() => {
    if (isLast) {
        const loadOptions = {
            root: null,
            rootMargin: '0px',
            thresholds: [0.75],
        };

        const callback = (entries: any, intersectionObserver: any) => {
            entries.forEach((entry: any) => {
                if (entry.isIntersecting) {
                    handleNextScreen();
                    intersectionObserver.unobserve(entry.target);
                }
            });
        };

        const intersectionObserver = new IntersectionObserver(callback, loadOptions);

        if (elementRef.current) {
            intersectionObserver.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                intersectionObserver.unobserve(elementRef.current);
            }
        };
    }
}, []);

return (
    <>
        {windowsize.width > 1024 && (
                <Link {...LinkProps} to={`/${streetcode.url}`} onClick={() => toStreetcodeRedirectClickEvent(streetcode.url, 'catalog')}>
                <div ref={elementRef} className="catalogItemText">
                    <div className="heading">
                        <p>{streetcode.title}</p>
                        {
                            streetcode.alias !== null && streetcode.alias?.trim() !== '' ? (
                                <p className="aliasText">
                                    (
                                    {streetcode.alias}
                                    )
                                </p>
                            ) : undefined
                        }
                    </div>
                </div>
                </Link>
        )}
        {windowsize.width <= 1024 && (
            <div>
                    <Link {...LinkProps} to={`/${streetcode.url}`} onTouchStart={() => toStreetcodeRedirectClickEvent(streetcode.url, 'catalog')} />
                <div ref={elementRef} className="catalogItemText mobile">
                    <div className="heading" onClick={handleTextClick}>
                        <p>{streetcode.title}</p>
                        {
                            streetcode.alias !== null && streetcode.alias?.trim() !== '' ? (
                                <p className="aliasText">{streetcode.alias}</p>
                            ) : undefined
                        }
                    </div>
                </div>
            </div>
        )}
    </>
);
};

export default observer(StreetcodeCatalogItem);
