import TagItem from "@/features/TagItem/TagItem";
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
                <div className="tag-list">
                    {props.Tags.map(tag =>(<TagItem Tag={tag}></TagItem>))}
                </div>
            </div>
        </div>
    );
}

export default RelatedFigureSliderItem;