import './OtherPartnerItem.styles.scss';

const OtherPartnerItem = ({ partner }) => (
    <div className="otherPartnerItem">
        <img src={partner.logo} alt="" />
    </div>
);

export default OtherPartnerItem;
