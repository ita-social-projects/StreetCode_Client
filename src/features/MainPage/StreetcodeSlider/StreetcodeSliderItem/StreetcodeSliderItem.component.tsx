import './StreetcodeSliderItem.styles.scss';

import { useMediaQuery } from 'react-responsive';

import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { toStreetcodeRedirectClickEvent } from '@/app/common/utils/googleAnalytics.unility';
import Image from '@/models/media/image.model';
import { StreetcodeMainPage } from '@/models/streetcode/streetcode-types.model';

interface Props {
    streetcode: StreetcodeMainPage;
    image : Image
}

const StreetcodeSliderItem = ({ streetcode, image }: Props) => {
    const windowsize = useWindowSize();
    const isMobile = useMediaQuery({
        query: '(max-width: 480px)',
    });

    const id = streetcode?.id;

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) {
            return text;
        }
        const truncatedText = text.substring(0, maxLength);
        return `${truncatedText.substring(0, truncatedText.lastIndexOf(' '))}...`;
    };

    const teaserText = truncateText(streetcode?.teaser || '', 340);

    const handleClickRedirect = () => {
        toStreetcodeRedirectClickEvent(streetcode.transliterationUrl, 'main_page');
        window.location.href = streetcode.transliterationUrl;
    };

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        handleClickRedirect();
    };

    return (
        <div className="mainPageStreetCodeSlider">
            <div className="itemStreetCodeMainPage" onClick={isMobile ? handleClickRedirect : undefined}>
                <div className="leftSlider">
                    <div className="leftSliderContent">
                        <img
                            key={image?.id}
                            src={base64ToUrl(image?.base64, image?.mimeType)}
                            className="streetcodeMainPageImg"
                        />
                    </div>
                </div>
                <div className="rightSlider">
                    <div className="streetcodeMainPageContainer">
                        <div className="textContainer">
                            {windowsize.width > 1024 && (
                                <h2 className="streercodeTitle">
                                    {streetcode?.title}
                                </h2>
                            )}
                            <div className="streetcodeAlias">
                                {streetcode?.text}
                            </div>
                            {windowsize.width > 1024 && (
                                <div>
                                    <p className="streetcodeTeaser">
                                        {teaserText}
                                    </p>
                                </div>
                            )}
                            <div>
                                <a
                                    className="streetcodeLink"
                                    href={streetcode.transliterationUrl}
                                    onClick={handleLinkClick}
                                >
                                    До стріткоду
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default StreetcodeSliderItem;
