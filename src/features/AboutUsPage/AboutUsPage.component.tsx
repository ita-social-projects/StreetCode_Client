import './AboutUsPage.styles.scss'
import AboutUsHeaderText from './AboutUsHeaderText/AboutUsHeaderText.component';
import Founders from './Founders/Founders.component';
import Vacancies from './Vacancies/Vacancies.component';

const AboutUsPage = () => (
    <div className="aboutUsPageContainer">
        <div className='contentContainer'>
            <AboutUsHeaderText />
            <Founders />
            <Vacancies />
        </div>
    </div>
);

export default AboutUsPage;