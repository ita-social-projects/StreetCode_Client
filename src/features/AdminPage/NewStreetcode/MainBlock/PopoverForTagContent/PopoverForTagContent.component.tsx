import './PopoverForTagContent.styles.scss';

import React from 'react';

import TagList from '@/app/common/components/TagList/TagList.component';
import { StreetcodeTag } from '@/models/additional-content/tag.model';

const PopoverForTagContent: React.FC<{ screenWidth: number, tags: StreetcodeTag[] }> = ({ screenWidth, tags }) => (
    <div className={screenWidth < 1024 ? 'mobile-version' : 'laptop-version'}>
        <TagList tags={tags.filter((t) => t.isVisible)} />
    </div>
);
export default PopoverForTagContent;
