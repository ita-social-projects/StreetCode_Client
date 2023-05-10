import './MainPage.styles.scss';
import ScrollToTopBtn from "../../app/common/components/ScrollToTopBtn/ScrollToTopBtn.component";
import Footer from "../../app/layout/footer/Footer.component";
import ProgressBar from "../ProgressBar/ProgressBar.component";
import DonateBtn from "../StreetcodePage/DonateBtn/DonateBtn.component";
import TextBlockComponent from '../StreetcodePage/TextBlock/TextBlock.component';
import TopCarouselComponent from './TopCarousel/TopCarousel.component';
const mainPageContent = () => {
    return (
        <div className="mainPageContainer">
            <div className="sticky">
                <div className="sticky-content">
                    <ScrollToTopBtn />
                    <DonateBtn />
                </div>
            </div>
            <TopCarouselComponent/>
            {/* <Footer /> */}
        </div>
    );
}

export default mainPageContent;
