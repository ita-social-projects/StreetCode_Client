import "./RelatedFigureSliderItem.styles.scss";

interface Props {
    TextHeading:string,
    ImageSrc:string
}

const RelatedFigureSliderItem = (props: Props) => {
    return (
        <div className={"relatedFigureSlide"}>
            <div className={"slideImage"}>
                <img src={props.ImageSrc}/>
            </div>
            <div className={"slideText"}>
                <h3 className={"heading"}>{props.TextHeading}</h3>
            </div>
        </div>
    );
}

export default RelatedFigureSliderItem;