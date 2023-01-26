import './PartnerItem.styles.scss';

import { Popover } from 'antd';

import Partner from '@/models/partners/partners.model';

import PartnerContent from './PartnerContent/PartnerContent.content';

interface Props {
    partner: Partner
}

const PartnerItem = ({ partner }: Props) => (
    <div
        className="partnerItem"
    >
        <Popover content={<PartnerContent partner={partner} />} trigger="click">
            <img
                key={partner.id}
                className="partnerLogo"
                src={partner.logoUrl}
                alt={partner.title}
            />
        </Popover>
    </div>
);

export default PartnerItem;
