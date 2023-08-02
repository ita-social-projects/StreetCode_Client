import './FounderCard.styles.scss'
import Instagram from '@/assets/images/about-us/instagram.png'
import Facebook from '@/assets/images/about-us/facebook.png'
import Inna from '@assets/images/about-us/Inna.png'

const FounderCard = (founder: FounderProps) => {
    return (
        <div className='founderCard'>
            <div className='founderCardImageContainer' >
                <img className='founderImage' src={founder.founderImage} />
            </div>
            <div className='foundersTextBlock borderRadiusSmall'>
                <div className='founderCardTextContainer'>
                    <h2>{founder.founderName}</h2>
                    <p>{founder.founderRole}</p>
                    <div className='founderCardLinks'>
                        <a href={founder.founderFacebook}><img src={Facebook} /></a>
                        <a href={founder.founderInstagram}><img src={Instagram} /></a>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default FounderCard;