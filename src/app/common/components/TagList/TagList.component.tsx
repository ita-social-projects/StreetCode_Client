import './TagList.styles.scss';

import { Button } from 'antd';

interface Props {
    tags: string[] | undefined;
}

const TagList = ({ tags }: Props) => (
    <div className="tagContainer">
        {tags?.map((tag, idx) => (
            <Button className="tagItem" key={idx}>
                {tag}
            </Button>
        ))}
    </div>
);

export default TagList;
