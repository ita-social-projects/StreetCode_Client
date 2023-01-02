import "./RelatedFigures.styles.scss";
import Antonovich from "@assets/images/Antonovich.png";
import Ukrainka from "@assets/images/Ukrainka.png";
import Mazepa from "@assets/images/Mazepa.png";
import Ratushny from "@assets/images/Ratushny.png";
import Khmelnytsky from "@assets/images/Khmelnytsky.png"

import SlickSlider from "@features/SlickSlider/SlickSlider.component";
import RelatedFigureSliderItem from
        "@/features/RelatedFiguresBlock/RelatedFigureItem/RelatedFigureItem";
import BlockHeading from "@features/BlockHeading/BlockHeading.component";
import RelatedFigure from "@/models/streetcode/related-figure.model";


interface Props {

}

var relatedFigures: RelatedFigure[] = [
    {Title:"Володимир Антонович",Image:{id:1,url:{id:1,href:Antonovich}},Tags:[{id:1,title:"Наукова школа"}, {id:1,title:"tag"}]}
    ,{Title:"Леся Українка",Image:{id:1,url:{id:1,href:Ukrainka}},Tags:[{id:1,title:"tag"}]}
    ,{Title:"Іван Мазепа",Image:{id:1,url:{id:1,href:Mazepa}},Tags:[{id:1,title:"tag"}]}
    ,{Title:"Роман Ратушний",Image:{id:1,url:{id:1,href:Ratushny}},Tags:[{id:1,title:"tag"}]}
    ,{Title:"Богдан хмельницький",Image:{id:1,url:{id:1,href:Khmelnytsky}},Tags:[{id:1,title:"tag"}]}
    ]

const RelatedFiguresComponent = (props: Props) => {
    const sliderItems = relatedFigures
    .map(figure => (
        <RelatedFigureSliderItem
            TextHeading={figure.Title}
            ImageSrc={figure.Image.url.href}
            Tags={figure.Tags}
        />
    ))

    return (
        <div className='relatedFiguresWrapper' style={{height: relatedFigures.length>4?'pxToRem(681px)':'pxToRem(613px)'}}>
            <div className='relatedFiguresContainer'>
                <BlockHeading headingText="Зв'язки історії" />
                <div className='relatedFiguresSliderContainer'>
                    <div style={{height: "100%"}}>
                        <SlickSlider
                            className='heightContainer'
                            slidesToShow={Math.min(relatedFigures.length,4)}
                            slides={sliderItems}
                            dots={false}
                        />
                    </div>
                </div>
                <div className="moreInfo" style={{visibility: relatedFigures.length>4?'visible':'hidden'}}>
                    <a>Дивитися всіх</a>
                </div>
            </div>
        </div>
    );
}

export default RelatedFiguresComponent;