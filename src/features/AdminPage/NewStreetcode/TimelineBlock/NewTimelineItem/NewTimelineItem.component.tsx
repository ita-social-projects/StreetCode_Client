import React from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const NewTimelineItem: React.FC<{ timelineTitle:string }> = ({ timelineTitle }) => (
    <div className="timeline-admin-item timeline-admin-item-short-timeline new-timeline-item-component">
        <DeleteOutlined />
        <div>
            <p>{timelineTitle}</p>
        </div>
        <EditOutlined />
    </div>
);
export default NewTimelineItem;
