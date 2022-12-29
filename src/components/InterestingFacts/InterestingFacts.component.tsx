import SlickSlider from "../../features/SlickSlider/SlickSliderBase";
import InterestingFactSliderItem
    from "../../features/SlickSlider/SliderItems/InterestingFactSliderItem/InterestingFactSliderItem";
import "./InterestingFacts.styles.css"
import BlockHeading from "../../features/BlockHeading/BlockHeading.component";

interface Props {

}
let textPlaceholder="7 (20) березня члени Центральної Ради обрали Михайла Грушевського своїм головою. Рішення було прийняте без відома самого Грушевського, що свідчить про його колосальний авторитет. На той час Грушевський навіть знаходився поза Україною, але повернувся, щоб обійняти посаду.";
let imagePlaceholder = require("../../assets/images/WowFacts1.png");
const InterestingFactsComponent = ({  }: Props) => {
    const settings = {
        dots: true,
        arrows:true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        centerMode: true,
        centerPadding: '5px'
    }
    return (
        <div className={"interestingFactsWrapper"}>
        <div className={"interestingFactsContainer"}>
            <BlockHeading headingText={"Wow-факти"}/>
            <div className={"interestingFactsSliderContainer"}>
                <div style={{height:"100%"}}>
                    <SlickSlider className={"heightContainer"} {...settings}   slides={[<InterestingFactSliderItem TextHeading={"Голова Центральної Ради"} MainText={textPlaceholder} ImageSrc={imagePlaceholder}/>,<InterestingFactSliderItem TextHeading={"Голова Центральної Ради"} MainText={textPlaceholder} ImageSrc={imagePlaceholder}/>,<InterestingFactSliderItem TextHeading={"Голова Центральної Ради"} MainText={textPlaceholder} ImageSrc={imagePlaceholder}/>,<InterestingFactSliderItem TextHeading={"Голова Центральної Ради"} MainText={textPlaceholder} ImageSrc={imagePlaceholder}/>]}/>
                </div>
            </div>
        </div>
        </div>
    );
}

export default InterestingFactsComponent;