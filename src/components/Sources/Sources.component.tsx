import "./Sources.styles.css"

import SlickSlider from "@features/SlickSlider/SlickSliderBase";
import SourcesSlideItem from "@features/SlickSlider/SliderItems/SourcesSliderItem/SourcesSliderItem";
import BlockHeading from "@features/BlockHeading/BlockHeading.component";

interface Props {

}

const SourcesComponent = (props: Props) => {
    const slides = ["Книги", "Статті", "Фільми", "Постаті"].map(t => <SourcesSlideItem text={t} />)

    const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
    }

    return (
        <div className={"sourcesContainer"}>
            <BlockHeading headingText={"Для фанатів"} />
            <div style={{height: "250px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <div className={"sourcesSliderContainer"}>
                    <SlickSlider {...settings} slidesToShow={3} slides={slides} />
                </div>
            </div>
        </div>
    )
}

export default SourcesComponent