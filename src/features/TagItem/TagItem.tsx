import Tag from "@/models/additional-content/tag.model";
import "./TagItem.style.scss";

interface Props {
    Tag:Tag
}

const TagItem = (props: Props) => {
    return(
        <div className="tag">
            <p>{props.Tag.title}</p>
        </div>
    );
}

export default TagItem;