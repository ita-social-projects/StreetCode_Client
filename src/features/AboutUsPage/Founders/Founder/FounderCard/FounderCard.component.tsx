import './FounderCard.styles.scss';

import Facebook from '@/assets/images/partners/facebook.svg';
import Instagram from '@/assets/images/partners/instagram.svg';

const FounderCard = (founder: FounderProps) => (
    <div className="founderCard">
        <div className="founderCardImageContainer">
            <img className="founderImage" src={founder.founderImage} />
        </div>
        <div className="foundersTextBlock borderRadiusSmall">
            <div className="founderCardTextContainer">
                <h2>{founder.founderName}</h2>
                <p>{founder.founderRole}</p>
                <div className="founderCardLinks">
                    <a href={founder.founderFacebook}><Facebook /></a>
                    <a href={founder.founderInstagram}><Instagram /></a>
                </div>
            </div>
        </div>
    </div>
);
export default FounderCard;
