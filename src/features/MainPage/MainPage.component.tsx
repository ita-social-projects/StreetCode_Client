import './MainPage.styles.scss';
import ScrollToTopBtn from "../../app/common/components/ScrollToTopBtn/ScrollToTopBtn.component";
import Footer from "../../app/layout/footer/Footer.component";
import ProgressBar from "../ProgressBar/ProgressBar.component";
import DonateBtn from "../StreetcodePage/DonateBtn/DonateBtn.component";
import TextBlockComponent from '../StreetcodePage/TextBlock/TextBlock.component';

const mainPageContent = () => {
    return (
        <div className="mainPageContainer">

            {/*<ProgressBar >*/}

            {/*</ProgressBar>*/}
            <div className="sticky">
                <div className="sticky-content">
                    <ScrollToTopBtn />
                    <DonateBtn />
                </div>
            </div>
        </div>
    );

}
export default mainPageContent;
