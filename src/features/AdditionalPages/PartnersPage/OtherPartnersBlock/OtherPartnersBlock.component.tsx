import './OtherPartnersBlock.styles.scss';

import OtherPartnerItem from './OtherPartnerItem/OtherPartnerItem.component';

const OtherPartnersBlock = ({ partners }) => {
    const keyPartnerItems = partners.map((partner) => (
        <OtherPartnerItem partner={partner} />
    ));

    return (
        <div className="keyPartnersBlock">
            {keyPartnerItems}
        </div>
    );
};

export default OtherPartnersBlock;
