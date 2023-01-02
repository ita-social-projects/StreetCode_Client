import Tag from "@/models/additional-content/tag.model";
import "./RelatedFigureSliderItem.styles.scss";

interface Props {
    TextHeading:string,
    ImageSrc:string,
    Tags:Tag[]
}

const RelatedFigureSliderItem = (props: Props) => {
    return (
        <div className={"relatedFigureSlide"} style={{
                backgroundImage: "url("+props.ImageSrc+")"}}>
            <div className={"slideText"}>
                <h3 className={"heading"}>{props.TextHeading}</h3>
                <div className={"tagList"}>
                    {props.Tags.map(tag =>(
                        <div className="tag">
                            <p>{tag.title}</p>
                        </div>))}
                </div>
            </div>
        </div>
    );
}

export default RelatedFigureSliderItem;