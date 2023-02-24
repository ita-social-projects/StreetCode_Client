import React, { useState } from 'react';
import './DragableTags.styles.scss';
import { Button } from 'antd';

import TagItem from '@/app/common/components/Tag/TagItem.component';
import { TagVisible } from '@/models/additional-content/tag.model';

const ClickableTagItem: React.FC<{ tag: TagVisible }> = ({ tag }) => {
    const [curTag, setTag] = useState<TagVisible>(tag);
    const onClick = (e) => {
        console.log(curTag);
        setTag({ ...curTag, visible: !curTag.visible });
    };
    return (
        <div onClick={onClick} className={curTag.visible ? '' : 'item-blured'} draggable>
            <TagItem tag={curTag} />
        </div>
    );
};

export default ClickableTagItem;
