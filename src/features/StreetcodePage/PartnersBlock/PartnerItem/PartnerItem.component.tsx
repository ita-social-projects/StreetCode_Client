import './PartnerItem.styles.scss';

import Partner from '@models/partners/partners.model';

import { Popover } from 'antd';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

import PartnerContent from './PartnerContent/PartnerContent.component';

interface Props {
    partner: Partner;
}

const PartnerItem = ({ partner }: Props) => (
    <div
        className="partnerItem"
    >
        <Popover
            overlayClassName="partnerPopover"
            content={<PartnerContent key={`pc${partner.id}`} partner={partner} />}
            trigger="hover"
        >
            <img
                key={partner.id}
                className="partnerLogo"
                src={base64ToUrl(partner.logo?.base64, partner.logo?.mimeType)}
                alt={partner.title}
            />
        </Popover>
    </div>
);

export default PartnerItem;
