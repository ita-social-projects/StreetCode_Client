import './PartnerItem.styles.scss';

import { useAsync } from '@hooks/stateful/useAsync.hook';
import Partner from '@models/partners/partners.model';
import useMobx from '@stores/root-store';

import { Popover } from 'antd';

import PartnerContent from './PartnerContent/PartnerContent.component';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

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
                    src={base64ToUrl(getImage(partner.logoId)?.base64, getImage(partner.logoId)?.mimeType)}
                    alt={partner.title}
                />
            </Popover>
        </div>
    );
};

export default PartnerItem;
