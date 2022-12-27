import SlickSliderTest from "../../pages/SlickSlider/SlickSliderTest";
import SourcesSlideItem from "../../pages/SlickSlider/SliderItems/SourcesSliderItem/SourcesSliderItem";
import "./Sources.styles.css"

interface Props {

}

const SourcesComponent = ({  }: Props) => {
    const settings = {
        dots: false,
        arrows:true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1
    }
    return (
        <div className={"sourcesContainer"}>
            <h1>Test</h1>
            <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
             <div className={"sourcesSliderContainer"}>
                    <SlickSliderTest {...settings}   slides={[<SourcesSlideItem text={"slide1"}/>,<SourcesSlideItem text={"slide2"}/>,<SourcesSlideItem text={"slide3"}/>,<SourcesSlideItem text={"slide4"}/>]}/>
             </div>
        </div>
        </div>
    );
}

export default SourcesComponent;