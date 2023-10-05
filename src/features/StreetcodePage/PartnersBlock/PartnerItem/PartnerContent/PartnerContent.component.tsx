import './PartnerContent.styles.scss';

import facebook from '@assets/images/partners/facebook.svg';
import instagram from '@assets/images/partners/instagram.svg';
import twitter from '@assets/images/partners/twitterNew.svg';
import youtube from '@assets/images/partners/youtube.svg';
import Image from '@models/media/image.model';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Partner from '@/models/partners/partners.model';

interface Props {
    partner: Partner
    image: Image | undefined;
}


const PartnerContent = ({ partner, image }: Props) => {
    const {
        id, title, targetUrl, partnerSourceLinks, description,
    } = partner;
    const LogoType = [twitter, instagram, facebook, youtube];

    return (
        <div className="partnerContent">
            <div className="header">
                <div className="partnerContentLogo">
                    <img
                        key={id}
                        src={base64ToUrl(image?.base64, image?.mimeType)}
                        alt={title}
                    />
                </div>
                <p>{title}</p>
            </div>
            <div className="links">
                <div
                    className="sourceLinks"
                    style={{ display: partnerSourceLinks.length < 1 ? 'none' : ' ' }}
                >
                    {partnerSourceLinks.map((sl, index) => {
                        const LogoComponent = LogoType[sl.logoType];
                        return (
                            <a
                                key={index}
                                rel="noreferrer"
                                target="_blank"
                                href={sl.targetUrl.href}
                            >
                                <LogoComponent />
                            </a>
                        );
                    })}
                </div>
                {partner.targetUrl?.href !== null ? (
                    <a
                        rel="noreferrer"
                        target="_blank"
                        className="mainLink"
                        href={targetUrl?.href}
                    >
                        {targetUrl?.title ?? 'до сторінки партнера'}
                    </a>
                ) : <></>}
            </div>
            <div
                className="description"
                style={{ display: description ? '' : 'none' }}
            >
                <p>{description}</p>
            </div>
        </div>
    );
};

export default PartnerContent;
