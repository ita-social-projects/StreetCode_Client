import React from 'react';

import TagList from '@/app/common/components/TagList/TagList.component';
import { TagVisible } from '@/models/additional-content/tag.model';
import './PopoverForTagContent.styles.scss';
const PopoverForTagContent:React.FC<{ screenWidth:number, tags:TagVisible[] }> = ({ screenWidth, tags }) => {
    console.log(screenWidth);
    return (
        <div className={screenWidth < 700 ? 'mobile-version' : 'laptop-version'}>
            <TagList tags={tags.filter((t) => t.visible).map((t) => t.title)} />
        </div>

    );
};
export default PopoverForTagContent;
