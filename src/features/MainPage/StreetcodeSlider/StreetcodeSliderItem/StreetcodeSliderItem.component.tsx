import './StreetcodeSliderItem.styles.scss';

import { useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import CardText from '@components/CardText/CardText.component';
import useMobx from '@stores/root-store';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Image from '@/models/media/image.model';
import { StreetcodeMainPage } from '@/models/streetcode/streetcode-types.model';

interface Props {
    streetcode: StreetcodeMainPage | undefined;
    image: Image | undefined;
    index: number;
    allowIntersection: boolean;
}

const StreetcodeSliderItem = ({ streetcode, image, index, allowIntersection }: Props) => {
    const isMobile = useMediaQuery({
        query: '(max-width: 480px)',
    });
    const navigate = useNavigate();
    const historyState = { fromPage: 'main_page' };

    const elementRef = useRef<HTMLDivElement>(null);
    const { imagesStore, streetcodeMainPageStore } = useMobx();
    const handleClickRedirect = (e: React.MouseEvent<HTMLDivElement>) => {
        if (streetcode && streetcode.transliterationUrl) {
            const streetcodeUrl = streetcode.transliterationUrl;

            // if we click "До стріткоду" link, we don't want to redirect to streetcode page again
            if (!(e.target as HTMLLinkElement)?.href?.includes(streetcodeUrl)) {
                navigate(streetcodeUrl, {state: historyState});
            }
        }
    };

    const FetchNextAndPreviousStreetcodes = async () => {
        await streetcodeMainPageStore.fetchLastStreetcodeWithOffset(index + 1)
            .then(async () => imagesStore.fetchImage(streetcodeMainPageStore.getStreetcodesArray[index + 1]?.imageId));
        await streetcodeMainPageStore.fetchLastStreetcodeWithOffset(index - 1)
            .then(async () => imagesStore.fetchImage(streetcodeMainPageStore.getStreetcodesArray[index - 1]?.imageId));
    };

    useEffect(() => {
        const loadOptions = {
            root: null,
            rootMargin: '0px',
            thresholds: [0.25],
        };

        const callback = (entries : any, intersectionObserver : any) => {
            entries.forEach((entry : any) => {
                if (entry.isIntersecting && allowIntersection) {
                    FetchNextAndPreviousStreetcodes().then();
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
    }, []);

    return (
        <div className="mainPageStreetCodeSlider">
            <div
                ref={elementRef}
                className="itemStreetCodeMainPage"
                onClick={isMobile ? handleClickRedirect : undefined}
            >
                <div className="leftSlider">
                    <div className={`leftSliderContent ${image?.id ? '' : 'skeleton'}`}>
                        {image?.id
                            ? (
                                <img
                                    key={image?.id}
                                    alt={streetcode?.title}
                                    src={base64ToUrl(image?.base64, image?.mimeType)}
                                    className={`streetcodeMainPageImg ${image?.id ? 'imgVisible' : ''}`}
                                />
                            ) : <></>}
                    </div>
                </div>
                <div className="rightSlider">
                    <CardText
                        title={streetcode?.title}
                        text={streetcode?.teaser}
                        subTitle={streetcode?.text}
                        moreBtnText="До стріткоду"
                        moreBtnAsLink={{ link: streetcode?.transliterationUrl, state: historyState }}
                    />
                </div>
            </div>
        </div>
    );
};

export default StreetcodeSliderItem;
