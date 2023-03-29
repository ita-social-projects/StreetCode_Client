import './KeyPartnersBlock.styles.scss';

import KeyPartnerItem from './KeyPartnerItem/KeyPartnerItem.component';

const KeyPartnersBlock = ({ partners }) => {
    const keyPartnerItems = partners.map((partner) => (
        <KeyPartnerItem partner={partner} />
    ));

    return (
        <div className="keyPartnersBlock">
            {keyPartnerItems}
        </div>
    );
};

export default KeyPartnersBlock;
