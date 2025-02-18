/* eslint-disable no-restricted-imports */
import './MainPage.styles.scss';

import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';

import ScrollToTopBtn from '../../app/common/components/ScrollToTopBtn/ScrollToTopBtn.component';

import NewsSliderComponent from './NewsSlider/NewsSlider.component';
import PartnersBlockComponent from './PartnersBlockMain/PartnersBlockMain.component';
import StaticBanner from './StaticBanners/StaticBanner.component';
import StreetcodeSliderComponent from './StreetcodeSlider/StreetcodeSlider.component';
import TeamComponent from './TeamSlider/TeamComponent.component';
import TopCarouselComponent from './TopCarousel/TopCarousel.component';

const MainPageContent = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: '(max-width: 480px)' });

    return (
        <>
            <TopCarouselComponent />
            <div className="mainPageContainer">
                <StreetcodeSliderComponent />
                <StaticBanner
                    id="catalog"
                    blockName="Хочеш більше history-кодів?"
                    blockContent={
                        isMobile
                            ? 'Досить обмежувати свої знання про минуле нудними підручниками! '
                            + 'Переходь на сторінку всіх історичних постатей та подій '
                            + 'і дізнавайся про минуле у захоплюючій формі.'
                            : 'Не обмежуй знання про минуле нудними підручниками з минулого. '
                            + 'Переходь на сторінку history-кодів про постаті та події, '
                            + 'читай або слухай історичне та захоплююче.'
                    }
                    buttonName="До history-кодів"
                    setActionOnClick={() => {
                        navigate('../catalog');
                    }}
                />
                <NewsSliderComponent />
                <TeamComponent />
                <PartnersBlockComponent />
                <StaticBanner
                    id="support"
                    blockName="Слід в історії у кожного різний. У тебе може бути свій"
                    blockContent="Підтримай проєкт про історію в назвах вулиць.
                    Обери зручний спосіб для донату, який підсвітить історію в міських просторах.
                    Наш проєкт живе та пульсує завдяки небайдужим history-кодерам — таким, як ти!"
                    buttonName="Задонатити"
                    setActionOnClick={() => {
                        navigate('../support-us');
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

export default MainPageContent;
