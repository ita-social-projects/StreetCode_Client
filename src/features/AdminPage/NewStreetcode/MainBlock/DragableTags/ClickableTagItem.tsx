import './DragableTags.styles.scss';

import React, { useState } from 'react';

import { Button } from 'antd';

import TagItem from '@/app/common/components/Tag/TagItem.component';
import { StreetcodeTag } from '@/models/additional-content/tag.model';

const ClickableTagItem: React.FC<{
    tag: StreetcodeTag,
    setVisibility:(visible:boolean)=>void }> = ({ tag, setVisibility }) => {
        const [curTag, setTag] = useState<StreetcodeTag>({ ...tag });
        const onClick = (e) => {
            setVisibility(!curTag.isVisible);
            setTag({ ...curTag, isVisible: !curTag.isVisible });
        };
        return (
            <div onClick={onClick} className={curTag.isVisible ? '' : 'item-blured'} draggable>
                <TagItem tag={curTag} />
            </div>
        );
    };

export default ClickableTagItem;
