import './PartnerItem.styles.scss';

import { useAsync } from '@hooks/stateful/useAsync.hook';
import Partner from '@models/partners/partners.model';
import useMobx from '@stores/root-store';

import { Popover } from 'antd';

import PartnerContent from './PartnerContent/PartnerContent.component';

interface Props {
    partner: Partner;
}

const PartnerItem = ({ partner }: Props) => {
    const { imagesStore } = useMobx();
    const { fetchImage, getImage } = imagesStore;

    useAsync(
        () => fetchImage(partner.logoId),
        [partner.logoId],
    );

    return (
        <div
            className="partnerItem"
        >
            <Popover
                overlayClassName="partnerPopover"
                content={<PartnerContent partner={partner} />}
                trigger="click"
            >
                <img
                    key={partner.id}
                    className="partnerLogo"
                    src={getImage(partner.logoId)?.url.href}
                    alt={partner.title}
                />
            </Popover>
        </div>
    );
};

export default PartnerItem;
