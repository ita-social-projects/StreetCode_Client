import './PartnerContent.styles.scss';

import useMobx from '@stores/root-store';

import { Popover } from 'antd';

import Partner from '@/models/partners/partners.model';

interface Props {
    partner: Partner
}

const PartnerContent = ({ partner }: Props) => {
    const { imagesStore } = useMobx();
    const { getImage } = imagesStore;

    return (
        <div className="partnerContent">
            <div className="header">
                <div className="partnerContentLogo">
                    <img
                        key={partner.id}
                        src={getImage(partner.logoId)?.url.href}
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
                        <Popover content={<p>{sl.title}</p>} trigger="hover">
                            <a
                                className="sourceLink"
                                href={sl.targetUrl}
                            >
                                <img
                                    key={sl.id}
                                    src={sl.logoUrl}
                                    alt={sl.title}
                                />
                            </a>
                        </Popover>
                    ))}
                </div>
                <a
                    className="mainLink"
                    href={partner.targetUrl}
                >
                    {`go to ${partner.title} page`}
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
};

export default PartnerContent;
