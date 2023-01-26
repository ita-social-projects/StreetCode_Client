import './PartnerContent.styles.scss';

import Partner from '@/models/partners/partners.model';

interface Props {
    partner: Partner
}

const PartnerContent = ({ partner }:Props) => (
    <div className="partnerContent">
        <div className="header">
            <div className="partnerContentLogo">
                <img
                    key={partner.id}
                    src={partner.logoUrl}
                    alt={partner.title}
                />
            </div>
            <p>{partner.title}</p>
        </div>
        <div className="links">
            <div
                className="sourceLinks"
                style={{ display: partner.partnerSourceLinks.length < 1 ? 'none' : '' }}
            >
                {partner.partnerSourceLinks.map((sl) => (
                    <a
                        className="sourceLink"
                        href={sl.targetUrl}
                    >
                        <img
                            key={sl.id}
                            src={sl.logoUrl}
                            alt=""
                        />
                    </a>
                ))}
            </div>
            <a
                className="mainLink"
                href={partner.targetUrl}
            >
                {partner.targetUrl}
            </a>
        </div>
        <div
            className="description"
            style={{ display: partner.description ? '' : 'none' }}
        >
            <p>{partner.description}</p>
        </div>
    </div>
);

export default PartnerContent;
