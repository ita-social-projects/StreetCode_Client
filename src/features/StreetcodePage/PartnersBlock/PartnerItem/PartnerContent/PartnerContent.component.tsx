import './PartnerContent.styles.scss';

import facebook from '@assets/images/partners/facebook.webp';
import instagram from '@assets/images/partners/instagram.webp';
import twitter from '@assets/images/partners/twitter.webp';
import youtube from '@assets/images/partners/youtube.webp';
import useMobx from '@stores/root-store';
import Image from '@models/media/image.model';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Partner from '@/models/partners/partners.model';

interface Props {
    partner: Partner
    image: Image | undefined;
}

const LogoType = [twitter, instagram, facebook, youtube];

const PartnerContent = ({ partner, image }: Props) => {
    const {
        id, title, targetUrl, partnerSourceLinks, description,
    } = partner;

    return (
        <div className="partnerContent">
            <div className="header">
                <div className="partnerContentLogo">
                    <img
                        key={id}
                        src={base64ToUrl(image?.base64, image.mimeType)}
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
                    {partnerSourceLinks.map((sl) => (
                        <a
                            rel="noreferrer"
                            target="_blank"
                            className="sourceLink"
                            href={sl.targetUrl.href}
                        >
                            <img
                                key={sl.id}
                                src={LogoType[sl.logoType]}
                                alt={sl.targetUrl.title}
                            />
                        </a>
                    ))}
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
