import './Partners.styles.scss';

import logo1 from '@images/partners/logo1.png';
import logo2 from '@images/partners/logo2.png';
import logo3 from '@images/partners/logo3.png';

import Partner from '@models/partners/partners.model';

interface Props {

}

const partners: Partial<Partner>[] = [
    { id: 1, url: { id: 1, href: logo1 } },
    { id: 2, url: { id: 2, href: logo2 } },
    { id: 3, url: { id: 3, href: logo3 } },
];

const PartnersComponent = (props: Props) => (
    <div className={'partnersWrapper'}>
        <div className={'partnerContainer'}>
            {partners.map(partner => (
                <img className={'partnerItem'} src={partner.url?.href} alt=""/>
            ))}
        </div>
    </div>
)

export default PartnersComponent;