import './PartnerContent.styles.scss';

import useMobx from '@stores/root-store';

import { Popover } from 'antd';

import Partner from '@/models/partners/partners.model';

interface Props {
    partner: Partner
}

const PartnerContent = ({ partner }: Props) => {
    const {
        id, title, logoId, targetUrl, partnerSourceLinks, description,
    } = partner;
    const { imagesStore: { getImage } } = useMobx();

    return (
        <div className="partnerContent">
            <div className="header">
                <div className="partnerContentLogo">
                    <img
                        key={id}
                        src={getImage(logoId)?.url.href}
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
                    href={targetUrl}
                >
                    {`go to ${title} page`}
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
