import './PartnerItem.styles.scss';

import { useCallback, useState } from 'react';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Partner from '@models/partners/partners.model';
import useMobx from '@stores/root-store';

import { Popover } from 'antd';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';

import PartnerContent from './PartnerContent/PartnerContent.component';

interface Props {
    partner: Partner;
    handleImageLoad: () => void;
}

const PartnerItem = ({ partner, handleImageLoad }: Props) => {
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
                trigger="hover"
            >
                <img
                    key={partner.id}
                    className="partnerLogo"
                    src={base64ToUrl(getImage(partner.logoId)?.base64, getImage(partner.logoId)?.mimeType)}
                    alt={partner.title}
                    onLoad={handleImageLoad}
                />
            </Popover>
        </div>
    );
};

export default PartnerItem;
