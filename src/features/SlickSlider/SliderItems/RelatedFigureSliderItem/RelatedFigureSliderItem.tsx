import "./RelatedFigureSliderItem.styles.scss";

interface Props {
    TextHeading:string,
    ImageSrc:string,
    Tags:string
}

const RelatedFigureSliderItem = (props: Props) => {
    return (
        <div className={"relatedFigureSlide"} style={{
                backgroundImage: "url("+props.ImageSrc+")"}}>
            <div className={"slideText"}>
                <h3 className={"heading"}>{props.TextHeading}</h3>
                <div className="tag">
                    <p>{props.Tags}</p>
                </div>
            </div>
        </div>
    );
}

export default RelatedFigureSliderItem;