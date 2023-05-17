import './MainPage.styles.scss';
import ScrollToTopBtn from "../../app/common/components/ScrollToTopBtn/ScrollToTopBtn.component";
import Footer from "../../app/layout/footer/Footer.component";
import ProgressBar from "../ProgressBar/ProgressBar.component";
import InstagramBlock from './InstagramBlock/InstagramBlock.component';
import StaticBanner from './StaticBanners/StaticBanner.component';


const mainPageContent = () => {
    return (
        <div className="mainPageContainer">
            <ProgressBar>
                <></>
                <InstagramBlock/>
                <StaticBanner 
                    blockName='Ти теж можеш зробити свій вклад для розвитку нашого проєкту'
                    blockContent='Тож обирай зручний спосіб допомогти так, щоб проєкт пульсував та жив, а історія промовляла в міських просторах. З історії ми знаємо, що світ не без добрих людей, а Стріткод — не без добрих стріткодерів.'
                    buttonName='Підтримати'
                    setActionOnClick={()=>{}}
                />
            </ProgressBar>
            <div className="sticky">
                <div className="sticky-content">
                    <ScrollToTopBtn/>
                </div>
            </div>
            <Footer/>
        </div>
    );

}
export default mainPageContent;
