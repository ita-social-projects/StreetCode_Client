import './MainPage.styles.scss';
import ScrollToTopBtn from "../../app/common/components/ScrollToTopBtn/ScrollToTopBtn.component";
import Footer from "../../app/layout/footer/Footer.component";
import ProgressBar from "../ProgressBar/ProgressBar.component";
import InstagramBlock from './InstagramBlock/InstagramBlock.component';
import StaticBanner from './StaticBanners/StaticBanner.component';
import { useHref } from 'react-router-dom';


const mainPageContent = () => {
    return (
        <div className="mainPageContainer">
            <ProgressBar>
                <></>
                <StaticBanner
                    id='catalog'
                    blockName='Хочеш більше стріткодів?'
                    blockContent='Не обмежуй знання про минуле нудними підручниками з минулого. Переходь на сторінку стріткодів про постаті та події, читай або слухай історичне та захоплююче'
                    buttonName='До стріткодів'
                    setActionOnClick={() => {window.location.href = '../catalog'}}
                />
                <InstagramBlock/>
                <StaticBanner
                    id='support'
                    blockName='Ти теж можеш зробити свій вклад для розвитку нашого проєкту'
                    blockContent='Тож обирай зручний спосіб допомогти так, щоб проєкт пульсував та жив, а історія промовляла в міських просторах. З історії ми знаємо, що світ не без добрих людей, а Стріткод — не без добрих стріткодерів.'
                    buttonName='Підтримати'
                    setActionOnClick={() => {window.location.href = '../support-us'}}
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