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
    {Id:1,Title:"Володимир Антонович",Image:{id:1,url:{id:1,href:Antonovich}},Tags:[{id:1,title:"Наукова школа"}, {id:1,title:"tag"}]}
    ,{Id:2,Title:"Леся Українка",Image:{id:1,url:{id:1,href:Ukrainka}},Tags:[{id:1,title:"tag"}]}
    ,{Id:3,Title:"Іван Мазепа",Image:{id:1,url:{id:1,href:Mazepa}},Tags:[{id:1,title:"tag"}]}
    ,{Id:4,Title:"Роман Ратушний",Image:{id:1,url:{id:1,href:Ratushny}},Tags:[{id:1,title:"tag"}]}
    ,{Id:5,Title:"Богдан хмельницький",Image:{id:1,url:{id:1,href:Khmelnytsky}},Tags:[{id:1,title:"tag"}]}
    ]

const RelatedFiguresComponent = (props: Props) => {
    const sliderItems = relatedFigures
    .map(figure => (
        <RelatedFigureSliderItem
            Id={figure.Id}
            TextHeading={figure.Title}
            ImageSrc={figure.Image.url.href}
            Tags={figure.Tags}
        />
    ))

    return (
        <div 
            className={'relatedFiguresWrapper ' + (relatedFigures.length>4?'bigWrapper':'smallWrapper')}>
            <div className='relatedFiguresContainer'>
                <BlockHeading headingText="Зв'язки історії" />
                <div className={'relatedFiguresSliderContainer'}>
                    <div style={{height: "100%"}}>
                        <SlickSlider
                            className={'heightContainer'}
                            slidesToShow={4}
                            slides={sliderItems}
                            swipe={false}
                            dots={false}
                            toChangeSlidesOnClick={false}
                        />
                    </div>
                </div>
                <div className="moreInfo">
                    <p>Дивитися всіх</p>
                </div>
            </div>
        </div>
    );
}

export default RelatedFiguresComponent;