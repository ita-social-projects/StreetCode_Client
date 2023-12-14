import './PartnersBlock.styles.scss';

import React, { useState } from 'react';
import PartnersItem from '@features/AdditionalPages/PartnersPage/PartnersItem/PartnersItem.component';

import PartnersApi from '@/app/api/partners/partners.api';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import Partner from '@/models/partners/partners.model';

interface Props {
    onlyKeyPartners: boolean;
}

const PartnersBlock = ({ onlyKeyPartners }: Props) => {
    const [keyPartners, setKeyPartners] = useState<Partner[]>([]);
    const [otherPartners, setOtherPartners] = useState<Partner[]>([]);

    useAsync(
        () => {
            PartnersApi.getAllByIsKeyPartner(true)
                .then((res) => {
                    setKeyPartners(res);
                });

            if (!onlyKeyPartners) {
                PartnersApi.getAllByIsKeyPartner(false)
                    .then((result) => {
                        setOtherPartners(result);
                    });
            }
        },
    );

    const createPartnersItem = (partners: Partner[]) => partners.map((partner) => (
        <PartnersItem
            key={partner.id}
            partner={partner}
        />

    ));

    return (
        <div className="partnersBlock">
            <div className="keyPartnersBlock">
                {createPartnersItem(keyPartners)}
            </div>

            {!onlyKeyPartners
                ? (
                    <div className="otherPartnersBlock">
                        {createPartnersItem(otherPartners)}
                    </div>
                )
                : (<></>)}
        </div>
    );
};

export default PartnersBlock;
