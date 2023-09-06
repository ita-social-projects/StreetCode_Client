import './PartnersBlock.styles.scss';

import React, { useState } from 'react';
import PartnersItem from '@features/AdditionalPages/PartnersPage/PartnersItem/PartnersItem.component';

import ImagesApi from '@/app/api/media/images.api';
import PartnersApi from '@/app/api/partners/partners.api';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import Partner from '@/models/partners/partners.model';

interface Props {
    onlyKeyPartners : boolean;
}

const PartnersBlock = ({ onlyKeyPartners }: Props) => {

    const [keyPartners, setKeyPartners] = useState<Partner[]>([]);
    const [otherPartners, setOtherPartners] = useState<Partner[]>([]);

    useAsync(
        () => {
            PartnersApi.getAllByIsKeyPartner(true)
                .then((res) => {
                    Promise.all(res.map((p, index) => ImagesApi.getById(p.logoId)
                        .then((img) => {
                            res[index].logo = img;
                        }))).then(() => {
                        setKeyPartners(res);
                    });
                });

            if (!onlyKeyPartners) {
                PartnersApi.getAllByIsKeyPartner(false)
                    .then((result) => {
                        Promise.all(result.map((p, index) => ImagesApi.getById(p.logoId)
                            .then((img) => {
                                result[index].logo = img;
                            }))).then(() => {
                            setOtherPartners(result);
                        });
                    });
            }
        },
    );

    const createPartnersItem = (partners: Partner[]) => partners.map((partner) => (
        <PartnersItem key={partner.id} partner={partner} />

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
