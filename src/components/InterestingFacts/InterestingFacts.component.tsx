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
    const sliderItems = ["1Голова Центральної Ради", "2Голова Центральної Ради", "3Голова Центральної Ради", "4Голова Центральної Ради"].map(title => (
        <InterestingFactSliderItem
            TextHeading={title}
            MainText={textPlaceholder}
            ImageSrc={WowFactImg}
        />
    ))

    const toShowDots = sliderItems.length <=3 ? false : true;
    let updatedSlides = [...sliderItems];
    if (sliderItems.length>=2) {
        const maxSlidesToShow = 3;
        while (updatedSlides.length <= maxSlidesToShow) {
            updatedSlides = updatedSlides.concat(updatedSlides);
        }
    }

    return (
        <div className='interestingFactsWrapper'>
            <div className='interestingFactsContainer'>
                <BlockHeading headingText='Wow-факти' />
                <div className='interestingFactsSliderContainer'>
                    <div style={{height: "100%"}}>
                        <SlickSlider
                            toChangeSlidesOnClick={true}
                            className='heightContainer'
                            slides={updatedSlides}
                            slidesToShow={3}
                            centerMode={true}
                            swipe={false}
                            dots={toShowDots}
                            centerPadding={"-12px"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InterestingFactsComponent;