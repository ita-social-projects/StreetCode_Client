import './AboutUsPage.styles.scss'
import AboutUsHeaderText from './AboutUsHeaderText/AboutUsHeaderText.component';
import Founders from './Founders/Founders.component';

const AboutUsPage = () => (
    <div className="aboutUsPageContainer">
        <div className='contentContainer'>
            <AboutUsHeaderText />
            <Founders />
        </div>
    </div>
);

export default AboutUsPage;