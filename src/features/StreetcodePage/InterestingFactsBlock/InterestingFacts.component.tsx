import "./InterestingFacts.styles.scss"
import WowFactImg from "@images/interesting-facts/WowFacts1.png";

import SlickSlider from "@features/SlickSlider/SlickSlider.component";
import BlockHeading from "@streetcode/HeadingBlock/BlockHeading.component";
import InterestingFactItem from '@streetcode/InterestingFactsBlock/InterestingFactItem/InterestingFactItem.component';

interface Props {

}

const textPlaceholder = `7 (20) березня члени Центральної Ради обрали Михайла Грушевського своїм головою.
    Рішення було прийняте без відома самого Грушевського, що свідчить про його колосальний авторитет.
    На той час Грушевський навіть знаходився поза Україною, але повернувся, щоб обійняти посаду.
    longTextlongTextlongTextlongTextlongTextlongTextlongTextlongTextlongTextlongTextlongTextlongText`;


const InterestingFactsComponent = (props: Props) => {
    let sliderItems = [...["1Голова Центральної Ради", "2Голова Центральної Ради",
        "3Голова Центральної Ради", "4Голова Центральної Ради"].map(title => (
        <InterestingFactItem
            textHeading={title}
            mainText={textPlaceholder}
            imgSrc={WowFactImg}
        />
    ))];

    const showDots = sliderItems.length > 3;

    if (sliderItems.length >= 2) {
        const maxSlidesToShow = 3;
        while (sliderItems.length <= maxSlidesToShow) {
            sliderItems = sliderItems.concat(sliderItems);
        }
    }

    return (
        <div className='interestingFactsWrapper'>
            <div className='interestingFactsContainer'>
                <BlockHeading headingText='Wow-факти' />
                <div className='interestingFactsSliderContainer'>
                    <div style={{height: "100%"}}>
                        <SlickSlider
                            swipeOnClick={true}
                            className='heightContainer'
                            slides={sliderItems}
                            slidesToShow={3}
                            centerMode={true}
                            swipe={false}
                            dots={showDots}
                            centerPadding={"-12px"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InterestingFactsComponent;