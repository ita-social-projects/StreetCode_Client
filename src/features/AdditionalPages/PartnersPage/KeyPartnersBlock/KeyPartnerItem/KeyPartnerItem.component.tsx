import './KeyPartnerItem.styles.scss';

const KeyPartnerItem = ({ partner }) => (
    <div className="keyPartnerItem">
        <img src={partner.logo} alt="" />
    </div>
);

export default KeyPartnerItem;
