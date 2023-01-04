import "./InterestingFacts.styles.scss"
import WowFactImg from "@assets/images/WowFacts1.png";

import SlickSlider from "@features/SlickSlider/SlickSlider.component";
import InterestingFactSliderItem from
        "@features/SlickSlider/SliderItems/InterestingFactSliderItem/InterestingFactSliderItem"
import BlockHeading from "@features/BlockHeading/BlockHeading.component"


interface Props {

}

const textPlaceholder = `7 (20) березня члени Центральної Ради обрали Михайла Грушевського своїм головою.
    Рішення було прийняте без відома самого Грушевського, що свідчить про його колосальний авторитет.
    На той час Грушевський навіть знаходився поза Україною, але повернувся, щоб обійняти посаду.
    longTextlongTextlongTextlongTextlongTextlongTextlongTextlongTextlongTextlongTextlongTextlongText`;


const InterestingFactsComponent = (props: Props) => {
    const sliderItems = ["Голова Центральної Ради", "Голова Центральної Ради", "Голова Центральної Ради", "Голова Центральної Ради", "Голова Центральної Ради", "Голова Центральної Ради"].map(title => (
        <InterestingFactSliderItem
            TextHeading={title}
            MainText={textPlaceholder}
            ImageSrc={WowFactImg}
        />
    ))

    const centerMode = sliderItems.length < 4 ? false : true;
    const centerPadding = sliderItems.length <4 ? "0" : "-12px";

    return (
        <div className='interestingFactsWrapper'>
            <div className='interestingFactsContainer'>
                <BlockHeading headingText='Wow-факти' />
                <div className='interestingFactsSliderContainer'>
                    <div style={{height: "100%"}}>
                        <SlickSlider
                            className='heightContainer'
                            slides={sliderItems}
                            centerMode={centerMode}
                            swipe={false}
                            centerPadding={centerPadding}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InterestingFactsComponent;