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
            <div className="textBlockButton">
                <div
                    key={`new${timelineItem.id}`}
                    className="item"
                >
                    <div className="blockItem">
                        <EditOutlined
                            onClick={() => {
                                setModalOpened(true);
                                setEditTimelineItem(timelineItem);
                            }}
                        />
                    </div>
                    <div>
                        <p>{timelineItem.title}</p>
                    </div>
                    <div className="blockItem">
                        <DeleteOutlined onClick={() => timelineItemStore.deleteTimelineFromMap(timelineItem.id)} />
                    </div>
                </div>
            </div>
        );
    };
export default NewTimelineItem;
