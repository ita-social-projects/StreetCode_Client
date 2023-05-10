import './MainPage.styles.scss';
import ScrollToTopBtn from "../../app/common/components/ScrollToTopBtn/ScrollToTopBtn.component";
import Footer from "../../app/layout/footer/Footer.component";
import ProgressBar from "../ProgressBar/ProgressBar.component";
import DonateBtn from "../StreetcodePage/DonateBtn/DonateBtn.component";
import InstagramBlock from './InstagramBlock/InstagramBlock.component';


const mainPageContent = () => {
    return (
        <div className="mainPageContainer">
            <ProgressBar>
                <></>
                <InstagramBlock/>
            </ProgressBar>
            <div className="sticky">
                <div className="sticky-content">
                    <ScrollToTopBtn />
                    <DonateBtn />
                </div>
            </div>
            <Footer />
        </div>
    );

}
export default mainPageContent;
