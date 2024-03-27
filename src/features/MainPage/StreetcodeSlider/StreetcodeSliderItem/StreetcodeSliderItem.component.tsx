import './StreetcodeSliderItem.styles.scss';

import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import CardText from '@components/CardText/CardText.component';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Image from '@/models/media/image.model';
import { StreetcodeMainPage } from '@/models/streetcode/streetcode-types.model';

interface Props {
    streetcode: StreetcodeMainPage;
    image: Image | undefined
}

const StreetcodeSliderItem = ({ streetcode, image }: Props) => {
    const isMobile = useMediaQuery({
        query: '(max-width: 480px)',
    });

    const navigate = useNavigate();
    const historyState = { fromPage: 'main_page' };

    const handleClickRedirect = (e: React.MouseEvent<HTMLDivElement>) => {
        const streetcodeUrl = streetcode.transliterationUrl;

        // if we click "До стріткоду" link, we don't want to redirect to streetcode page again
        if (!(e.target as HTMLLinkElement)?.href?.includes(streetcodeUrl)) {
            navigate(streetcodeUrl, { state: historyState });
        }
    };

    return (
        <div className="mainPageStreetCodeSlider">
            <div className="itemStreetCodeMainPage" onClick={isMobile ? handleClickRedirect : undefined}>
                <div className="leftSlider">
                    <div className={`leftSliderContent ${image?.id ? '' : 'skeleton'}`}>
                        {image?.id
                            ? (
                                <img
                                    key={image.id}
                                    alt={streetcode?.title}
                                    src={base64ToUrl(image?.base64, image?.mimeType)}
                                    className={`streetcodeMainPageImg ${image?.id ? 'imgVisible' : ''}`}
                                />
                            ) : <></>}
                    </div>
                </div>
                <div className="rightSlider">
                    <CardText
                        title={streetcode.title}
                        text={streetcode.teaser}
                        subTitle={streetcode.text}
                        moreBtnText="До стріткоду"
                        moreBtnAsLink={{ link: streetcode.transliterationUrl, state: historyState }}
                    />
                </div>
            </div>
        </div>
    );
};

export default StreetcodeSliderItem;
