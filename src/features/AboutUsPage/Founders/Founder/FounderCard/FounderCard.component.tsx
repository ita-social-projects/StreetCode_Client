import './FounderCard.styles.scss';

import Facebook from '@/assets/images/partners/facebook.svg';
import Instagram from '@/assets/images/partners/instagram.svg';

const createLink = (url: string, iconComponent) => (
    <a href={url} target="_blank" rel="noreferrer">
        {iconComponent}
    </a>
);

const FounderCard = ({
    founderImage, founderName, founderRole, founderFacebook, founderInstagram,
}: FounderProps) => (
    <div className="founderCard">
        <div className="founderCardImageContainer">
            <img className="founderImage" src={founderImage} />
        </div>
        <div className="foundersTextBlock borderRadiusSmall">
            <div className="founderCardTextContainer">
                <h2>{founderName}</h2>
                <p>{founderRole}</p>
                <div className="founderCardLinks">
                    {createLink(founderFacebook, <Facebook />)}
                    {createLink(founderInstagram, <Instagram />)}
                </div>
            </div>
        </div>
    </div>
);
export default FounderCard;
