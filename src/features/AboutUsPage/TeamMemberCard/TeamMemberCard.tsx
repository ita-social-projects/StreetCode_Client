import './TeamMemberCard.styles.scss'
import Instagram from '@/assets/images/about-us/instagram.png'
import Facebook from '@/assets/images/about-us/facebook.png'
import Photo from '@/assets/images/about-us/pictureWIthBG.png'

const TeamMemberCard = (founder : FounderProps) => (
    <div className='cardContainer'>
        <div className='photoContainer'>
            <img src={Photo}/>
        </div>
        <div className='textContainer'>
            <h2>{founder.founderName}</h2>
            <p>{founder.founderRole}</p>
            <div className='linksContainer'>
                <a href={founder.founderFacebook}><img src={Facebook} /></a>
                <a href={founder.founderInstagram}><img src={Instagram} /></a>
            </div>
        </div>
    </div>
);

export default TeamMemberCard