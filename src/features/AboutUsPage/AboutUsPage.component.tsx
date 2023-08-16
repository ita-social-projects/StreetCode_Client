import './AboutUsPage.styles.scss'
import AboutUsHeaderText from './AboutUsHeaderText/AboutUsHeaderText.component';
import Founders from './Founders/Founders.component';
import Vacancies from './Vacancies/Vacancies.component';
import TeamMembers from './TeamMembers/TeamMembers.component';

const AboutUsPage = () => (
    <div className="aboutUsPageContainer">
        <div className='contentContainer'>
            <AboutUsHeaderText />
            <Founders />
            <TeamMembers />
            <Vacancies />
        </div>
    </div>
);

export default AboutUsPage;