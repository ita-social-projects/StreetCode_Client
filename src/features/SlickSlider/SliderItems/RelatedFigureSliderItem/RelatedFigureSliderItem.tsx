import "./RelatedFigureSliderItem.styles.scss";

interface Props {
    TextHeading:string,
    ImageSrc:string
}

const RelatedFigureSliderItem = (props: Props) => {
    return (
        <div className={"relatedFigureSlide"} style={{
                backgroundImage: "url("+props.ImageSrc+")"}}>
            <div className={"slideText"}>
                <h3 className={"heading"}>{props.TextHeading}</h3>
            </div>
        </div>
    );
}

export default RelatedFigureSliderItem;