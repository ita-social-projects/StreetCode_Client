import './StreetcodeSliderItem.styles.scss';

import { useMediaQuery } from 'react-responsive';
import CardText from '@components/CardText/CardText.component';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { toStreetcodeRedirectClickEvent } from '@/app/common/utils/googleAnalytics.unility';
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

    const handleClickRedirect = () => {
        if (streetcode.transliterationUrl) {
            toStreetcodeRedirectClickEvent(streetcode.transliterationUrl, 'main_page');
            window.location.href = streetcode.transliterationUrl;
        }
    };

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        handleClickRedirect();
    };

    return (
        <div className="mainPageStreetCodeSlider">
            <div className="itemStreetCodeMainPage" onClick={isMobile ? handleLinkClick : undefined}>
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
                        onBtnClick={handleLinkClick}
                    />
                </div>
            </div>
        </div>
    );
};

export default StreetcodeSliderItem;
