import './PartnersBlockMain.styles.scss';

import PartnersBlock from '@/features/AdditionalPages/PartnersPage/PartnersBlock/PartnersBlock.component';

import Heading from '../Heading/Heading.component';

const PartnersBlockComponent = () => (
    <div className="partnersBlockMainContainer">
        <Heading blockName="Наші партнери" buttonName={undefined} setActionOnClick={undefined} />
        <PartnersBlock />
    </div>
);

export default PartnersBlockComponent;
