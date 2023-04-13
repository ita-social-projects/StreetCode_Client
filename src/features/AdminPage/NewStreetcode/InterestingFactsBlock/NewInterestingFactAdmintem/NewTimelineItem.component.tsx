import React from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

// eslint-disable-next-line import/extensions
import useMobx from '@/app/stores/root-store';
import TimelineItem from '@/models/timeline/chronology.model';

const NewTimelineItem: React.FC<{
     timelineItem:TimelineItem, setModalOpened: React.Dispatch<React.SetStateAction<boolean>>,
     setEditTimelineItem: React.Dispatch<React.SetStateAction<TimelineItem | undefined>>
    }> = ({ timelineItem, setModalOpened, setEditTimelineItem }) => {
        const { timelineItemStore } = useMobx();
        return (
            <div
                key={`new${timelineItem.id}`}
                // className="timeline-admin-item timeline-admin-item-short-timeline new-timeline-item-component"
            >
                <DeleteOutlined onClick={() => timelineItemStore.deleteTimelineFromMap(timelineItem.id)} />
                <div>
                    <p>{timelineItem.title}</p>
                </div>
                <EditOutlined
                    onClick={() => {
                        setModalOpened(true);
                        setEditTimelineItem(timelineItem);
                    }}
                />
            </div>
        );
    };
export default NewTimelineItem;
