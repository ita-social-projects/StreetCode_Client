import './TagItem.styles.scss';

import { Button } from 'antd';

import { StreetcodeTag } from '@/models/additional-content/tag.model';

const TagItem: React.FC<{
    tag: StreetcodeTag
}> = ({ tag }) => (
    <Button className="tagItem" key={tag.id}>
        { tag.title }
    </Button>
);

export default TagItem;