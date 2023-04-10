import './PartnersItem.styles.scss';

import { useEffect, useState } from 'react';
import useMobx from '@stores/root-store';

import { Popover } from 'antd';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import PartnerContent
    from '@/features/StreetcodePage/PartnersBlock/PartnerItem/PartnerContent/PartnerContent.component';
import Partner from '@/models/partners/partners.model';

interface Props {
    partner: Partner;
}

const PartnersItem = ({ partner }: Props) => {
    const { imagesStore } = useMobx();
    const { fetchImage, getImage } = imagesStore;

    const [trigger, setTrigger] = useState('hover');

    useAsync(
        () => fetchImage(partner.logoId),
        [partner.logoId],
    );

    useEffect(() => {
        const resizeListener = () => setTrigger(window.innerWidth <= 480 ? 'click' : 'hover');

        window.addEventListener('resize', resizeListener);

        return () => window.removeEventListener('resize', resizeListener);
    }, []);

    return (
        <div className="partnersItem">
            <Popover
                overlayClassName="partnerPopover"
                content={<PartnerContent partner={partner} />}
                trigger={trigger}
            >
                <img
                    key={partner.id}
                    src={base64ToUrl(getImage(partner.logoId)?.base64, getImage(partner.logoId)?.mimeType)}
                    alt={partner.title}
                />
            </Popover>
        </div>
    );
};

export default PartnersItem;
