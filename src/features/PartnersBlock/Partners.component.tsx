import './Partners.styles.scss';

import logo1 from '@assets/images/logo1.png';
import logo2 from '@assets/images/logo2.png';
import logo3 from '@assets/images/logo3.png';

import Image from '@/models/media/image.model';

interface Props {

}

const partners: Image[] = [
    { id: 1, url: { id: 1, href: logo1 } },
     { id: 2, url: { id: 2, href: logo2 } },
     { id: 3, url: { id: 3, href: logo3 } },
];

function PartnersComponent(props: Props) {
  return (
    <div className="partnersWrapper">
      <div className="partnersContainer">
        {partners.map((partner) => (<img className="partner" src={partner.url.href} />))}
      </div>
    </div>
);
}

export default PartnersComponent;
