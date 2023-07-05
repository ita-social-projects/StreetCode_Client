import './MainPage.styles.scss';

import ScrollToTopBtn from '../../app/common/components/ScrollToTopBtn/ScrollToTopBtn.component';
import InstagramBlock from './InstagramBlock/InstagramBlock.component';
import PartnersBlockComponent from './PartnersBlockMain/PartnersBlockMain.component';
import StaticBanner from './StaticBanners/StaticBanner.component';
import StreetcodeSliderComponent from './StreetcodeSlider/StreetcodeSlider.component';
import TeamComponent from './TeamSlider/TeamComponent.component';
import TopCarouselComponent from './TopCarousel/TopCarousel.component';
import NewsSliderComponent from './NewsSlider/NewsSlider.component';

const mainPageContent = () => (
    <>
    <TopCarouselComponent/>
    <div className="mainPageContainer">
            <StreetcodeSliderComponent/>
            <StaticBanner
                id="catalog"
                blockName="Хочеш більше стріткодів?"
                blockContent="Не обмежуй знання про минуле нудними підручниками з минулого. Переходь на сторінку стріткодів про постаті та події, читай або слухай історичне та захоплююче."
                buttonName="До стріткодів"
                setActionOnClick={() => {
                    window.location.href = '../catalog';
                }}
            />
            <NewsSliderComponent/>
            <TeamComponent/>
            <PartnersBlockComponent/>
            <InstagramBlock/>
            <StaticBanner
                id="support"
                blockName="Слід в історії у кожного різний. У тебе може бути свій"
                blockContent="Підтримай проєкт про історію в назвах вулиць. Обери зручний спосіб для донату, який підсвітить історію в міських просторах. Наш проєкт живе та пульсує завдяки небайдужим стріткодерам — таким, як ти!"
                buttonName="Задонатити"
                setActionOnClick={() => {
                    window.location.href = '../support-us';
                }}
            />
   
        <div className="sticky">
            <div className="sticky-content">
                <ScrollToTopBtn/>
            </div>
        </div>
    </div>
    </>
);

export default mainPageContent;