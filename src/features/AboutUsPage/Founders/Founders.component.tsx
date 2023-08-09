import './Founders.styles.scss'
import Inna from '@assets/images/about-us/Inna.png'
import Natalia from '@assets/images/about-us/Nata.png'
import Founder from './Founder/Founder.component'
import TeamMemberCard from '../TeamMemberCard/TeamMemberCard.component'


const FounderInna: FounderProps =
{
    founderName: 'Інна Крупник',
    founderRole: 'Голова і співзасновниця ГО',
    founderImage: Inna,
    founderInstagram: 'https://www.instagram.com/krupnyk_inna/',
    founderFacebook: 'https://www.facebook.com/krupnyk.inna',
    founderText: '«На участь, до того ж найактивнішу, в проєкті «Стріткод: історія на кожному кроці» мене надихає розуміння того, наскільки українське суспільство та нація проапгрейдили власне розуміння себе та своєї історії за останні роки, наскільки відкриті вони до вивчення історії та спростування історичних міфів, наскільки хочуть бачити цю історію близькою до себе, пережитою та бути дотичною до неї. Це все наштовхує на необхідність важливих історичних проєктів, як просвітницьких, так і розважальних. Для широких верств та найширшого залучення в історію. Занурюймося!»',
    order: true
}

const FounderNatalia: FounderProps =
{
    founderName: 'Наталя Демідова',
    founderRole: 'Авторка ідеї, співзасновниця проєкту',
    founderImage: Natalia,
    founderInstagram: 'https://www.instagram.com/notatka8/',
    founderFacebook: 'https://www.facebook.com/NatalyaDemydiv',
    founderText: '«Я хочу, щоб українські діти, які зростатимуть після Перемоги, знали, хто в цьому світі на що здатний. Хочу, щоби розуміли причинно-наслідкові зв’язки і були захищені цим знанням. Для того маємо відновлювати історичну пам’ять вже зараз. Це водночас і просто, і складно. Просто – бо є проєкт «Стріткод», бачення, як його втілити, і команда, яка вже це робить. Складно, бо масштаби – вся Україна. Але це той проєкт, який має бути реалізований, тут без варіантів. Тому несемось!) Приєднуйтеся ;)»',
    order: false
}
const reverseOrder = true

const Founders = () => {
    return (
        <div className='aboutUsBlockContainer'>
            <h1><div /><text>Засновниці</text><div /></h1>
            <div className='foundersBlock'>
                {window.innerWidth > 600 ? <Founder {...FounderInna}/> : <TeamMemberCard {...FounderInna}/>}
                {window.innerWidth > 600 ? <Founder {...FounderNatalia}/> : <TeamMemberCard {...FounderNatalia}/>}
            </div>
        </div>
    );
}

export default Founders;