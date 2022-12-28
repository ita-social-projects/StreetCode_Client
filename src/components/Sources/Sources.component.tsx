import SlickSliderTest from "../../pages/SlickSlider/SlickSliderBase";
import SourcesSlideItem from "../../pages/SlickSlider/SliderItems/SourcesSliderItem/SourcesSliderItem";
import "./Sources.styles.css"
import BlockHeading from "../../pages/BlockHeading/BlockHeading.component";
let Left = require('../../assets/images/LeftDefaultSliderArrow.svg');

interface Props {

}

const SourcesComponent = ({  }: Props) => {
    const settings = {
        dots: true,
        arrows:true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
}
    return (
        <div>
        <div className={"sourcesContainer"}>
            <BlockHeading headingText={"Для фанатів"}/>
            <div style={{height:"250px", display:"flex", alignItems:"center", justifyContent:"center"}}>
             <div className={"sourcesSliderContainer"}>
                    <SlickSliderTest {...settings}   slides={[<SourcesSlideItem text={"Книги"}/>,<SourcesSlideItem text={"Фільми"}/>,<SourcesSlideItem text={"Статті"}/>,<SourcesSlideItem text={"slide4"}/>]}/>
             </div>
         </div>
        </div>
        </div>
    );
}

export default SourcesComponent;