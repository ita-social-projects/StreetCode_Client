import "./RelatedFigures.styles.scss";
import Antonovich from "@assets/images/Antonovich.png";
import Ukrainka from "@assets/images/Ukrainka.png";
import Mazepa from "@assets/images/Mazepa.png";
import Ratushny from "@assets/images/Ratushny.png";

import SlickSlider from "@features/SlickSlider/SlickSlider.component";
import RelatedFigureSliderItem from
        "@features/SlickSlider/SliderItems/RelatedFigureSliderItem/RelatedFigureSliderItem";
import BlockHeading from "@features/BlockHeading/BlockHeading.component";
import RelatedFigure from "@/models/streetcode/related-figure.model";


interface Props {

}

var relatedFigures: RelatedFigure[] = [
    {Title:"Володимир Антонович",Image:{id:1,url:{id:1,href:Antonovich}}},
    {Title:"Леся Українка",Image:{id:1,url:{id:1,href:Ukrainka}}},
    {Title:"Іван Мазепа",Image:{id:1,url:{id:1,href:Mazepa}}},
    {Title:"Роман Ратушний",Image:{id:1,url:{id:1,href:Ratushny}}}]

const RelatedFiguresComponent = (props: Props) => {
    const sliderItems = relatedFigures
    .map(figure => (
        <RelatedFigureSliderItem
            TextHeading={figure.Title}
            ImageSrc={figure.Image.url.href}
        />
    ))

    return (
        <div className='relatedFiguresWrapper'>
            <div className='relatedFiguresContainer'>
                <BlockHeading headingText="Зв'язки історії" />
                <div className='relatedFiguresSliderContainer'>
                    <div style={{height: "100%"}}>
                        <SlickSlider
                            className='heightContainer'
                            slidesToShow={4}
                            slides={sliderItems}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RelatedFiguresComponent;