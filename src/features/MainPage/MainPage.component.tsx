import './MainPage.styles.scss';

import ScrollToTopBtn from '../../app/common/components/ScrollToTopBtn/ScrollToTopBtn.component';
import Footer from '../../app/layout/footer/Footer.component';
import DonateBtn from '../StreetcodePage/DonateBtn/DonateBtn.component';

import StreetcodeSliderComponent from './StreetcodeSlider/StreetcodeSlider.component';
import TeamComponent from './TeamSlider/TeamComponent.component';
import TopCarouselComponent from './TopCarousel/TopCarousel.component';

const mainPageContent = () => (
    <div className="mainPageContainer">
        <div className="sticky">
            <div className="sticky-content">
                <ScrollToTopBtn />
                <DonateBtn />
            </div>
        </div>

        <TopCarouselComponent />
        <StreetcodeSliderComponent />
        <TeamComponent />
    </div>
);

export default mainPageContent;
