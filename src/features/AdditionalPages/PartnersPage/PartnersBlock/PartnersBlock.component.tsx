import './PartnersBlock.styles.scss';

import { useState } from 'react';
import PartnersItem from '@features/AdditionalPages/PartnersPage/PartnersItem/PartnersItem.component';

import ImagesApi from '@/app/api/media/images.api';
import PartnersApi from '@/app/api/partners/partners.api';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import Partner from '@/models/partners/partners.model';

const PartnersBlock = () => {
    const [partners, setPartners] = useState<Partner[]>([]);

    useAsync(
        () => {
            PartnersApi.getAll()
                .then((res) => {
                    Promise.all(res.map((p, index) => ImagesApi.getById(p.logoId)
                        .then((img) => {
                            res[index].logo = img;
                        }))).then(() => {
                        setPartners(res);
                    });
                });
        },
    );

    const [keyPartners, otherPartners] = partners.reduce(
        (acc: [Partner[], Partner[]], partner: Partner) => {
            acc[partner.isKeyPartner ? 0 : 1].push(partner);
            return acc;
        },
        [[], []] as [Partner[], Partner[]],
    );

    const createPartnersItem = (partners: Partner[]) => partners.map((partner) => (
        <PartnersItem key={partner.id} partner={partner} />

    ));

    return (
        <div className="partnersBlock">
            <div className="keyPartnersBlock">
                {createPartnersItem(keyPartners)}
            </div>
            <div className="otherPartnersBlock">
                {createPartnersItem(otherPartners)}
            </div>
        </div>
    );
};

export default PartnersBlock;
