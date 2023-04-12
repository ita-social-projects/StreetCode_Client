import './PartnersBlock.styles.scss';

import PartnersItem from '@features/AdditionalPages/PartnersPage/PartnersItem/PartnersItem.component';
import useMobx from '@stores/root-store';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import Partner from '@/models/partners/partners.model';

const PartnersBlock = () => {
    const { partnersStore } = useMobx();
    const { getAll, getPartnerArray } = partnersStore;

    useAsync(
        () => Promise.all([
            getAll(),
        ]),
    );

    const [keyPartners, otherPartners] = getPartnerArray.reduce(
        (acc: [Partner[], Partner[]], partner: Partner) => {
            acc[partner.isKeyPartner ? 0 : 1].push(partner);
            return acc;
        },
        [[], []] as [Partner[], Partner[]],
    );

    const createPartnersItem = (partners: Partner[]) => partners.map((partner) => (
        <PartnersItem partner={partner} />
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
