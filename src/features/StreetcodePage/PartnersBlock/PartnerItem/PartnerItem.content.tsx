import './partnerItem.styles.scss';

import { Popover } from 'antd';

import Partner from '@/models/partners/partners.model';

import PartnerContent from './PartnerContent/PartnerContent.component';

interface Props {
    partner: Partner
}

const PartnerItem = ({ partner }: Props) => (
    <Popover content={<PartnerContent partner={partner} />} trigger="click">
        <div
            className="partnerItem"
        >
            <img
                key={partner.id}
                className="partnerLogo"
                src={partner.logoUrl}
                alt={partner.title}
            />
        </div>
    </Popover>
);

export default PartnerItem;