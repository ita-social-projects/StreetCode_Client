import './TagList.styles.scss';
import { Button } from "antd";

interface Props {
    tags: string[] | undefined;
}

const TagList = (props: Props) => {
    return (
        <div className={"tagContainer"}>
            {props.tags?.map((tag, i) => (
                <Button className={"tagItem"} key={i}>
                    {tag}
                </Button>
            ))}
        </div>
    );
};

export default TagList;