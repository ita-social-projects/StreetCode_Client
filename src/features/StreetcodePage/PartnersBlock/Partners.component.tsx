import './Partners.styles.scss';

import logo1 from '@images/partners/logo1.png';
import logo2 from '@images/partners/logo2.png';
import logo3 from '@images/partners/logo3.png';

import Partner from '@models/partners/partners.model';

const partners: Partial<Partner>[] = [
    { id: 1, url: { id: 1, href: logo1 } },
    { id: 2, url: { id: 2, href: logo2 } },
    { id: 3, url: { id: 3, href: logo3 } },
];

const PartnersComponent = () => (
    <div className="partnersWrapper">
        <div className="partnerContainer">
            {partners.map(({ id, url }) => (
                <img key={id} className="partnerItem" src={url?.href} alt="" />
            ))}
        </div>
    </div>
);

export default PartnersComponent;
