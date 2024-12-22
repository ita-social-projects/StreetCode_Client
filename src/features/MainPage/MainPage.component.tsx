import "./MainPage.styles.scss";

import { useNavigate } from "react-router-dom";

import ScrollToTopBtn from "../../app/common/components/ScrollToTopBtn/ScrollToTopBtn.component";

import InstagramBlock from "./InstagramBlock/InstagramBlock.component";
import NewsSliderComponent from "./NewsSlider/NewsSlider.component";
import PartnersBlockComponent from "./PartnersBlockMain/PartnersBlockMain.component";
import StaticBanner from "./StaticBanners/StaticBanner.component";
import StreetcodeSliderComponent from "./StreetcodeSlider/StreetcodeSlider.component";
import TeamComponent from "./TeamSlider/TeamComponent.component";
import TopCarouselComponent from "./TopCarousel/TopCarousel.component";
import ErrorBoundary from "@/app/common/components/ErrorBoundary/ErrorBoundary";

const mainPageContent = () => {
    const navigate = useNavigate();

    return (
        <>
            <TopCarouselComponent />
            <div className="mainPageContainer">
                <StreetcodeSliderComponent />
                <StaticBanner
                    id="catalog"
                    blockName="Хочеш більше history-кодів?"
                    blockContent="Не обмежуй знання про минуле нудними підручниками з минулого.
                    Переходь на сторінку history-кодів про постаті та події, читай або слухай історичне та захоплююче."
                    buttonName="До history-кодів"
                    setActionOnClick={() => {
                        navigate("../catalog");
                    }}
                />
                <NewsSliderComponent />
                <TeamComponent />
                <PartnersBlockComponent />
                <ErrorBoundary fallback={<></>}>
                    <InstagramBlock />
                </ErrorBoundary>
                <StaticBanner
                    id="support"
                    blockName="Слід в історії у кожного різний. У тебе може бути свій"
                    blockContent="Підтримай проєкт про історію в назвах вулиць.
                    Обери зручний спосіб для донату, який підсвітить історію в міських просторах.
                    Наш проєкт живе та пульсує завдяки небайдужим history-кодерам — таким, як ти!"
                    buttonName="Задонатити"
                    setActionOnClick={() => {
                        navigate("../support-us");
                    }}
                />

                <div className="sticky">
                    <div className="sticky-content">
                        <ScrollToTopBtn />
                    </div>
                </div>
            </div>
        </>
    );
};

export default mainPageContent;
