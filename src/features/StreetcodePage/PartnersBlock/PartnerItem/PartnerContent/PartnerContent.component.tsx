import './PartnerContent.styles.scss';

import facebook from '@assets/images/partners/facebook.png';
import instagram from '@assets/images/partners/instagram.png';
import twitter from '@assets/images/partners/twitter.png';
import youtube from '@assets/images/partners/youtube.png';
import useMobx from '@stores/root-store';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Partner from '@/models/partners/partners.model';

interface Props {
    partner: Partner
}

const LogoType = [twitter, instagram, facebook, youtube];

const PartnerContent = ({ partner }: Props) => {
    const {
        id, title, targetUrl, partnerSourceLinks, description,
    } = partner;

    return (
        <div className="partnerContent">
            <div className="header">
                <div className="partnerContentLogo">
                    <img
                        key={id}
                        src={base64ToUrl(partner.logo?.base64, partner.logo?.mimeType)}
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
                <a
                    rel="noreferrer"
                    target="_blank"
                    className="mainLink"
                    href={targetUrl?.href}
                >
                    {targetUrl?.title ?? 'до сторінки партнера'}
                </a>
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
