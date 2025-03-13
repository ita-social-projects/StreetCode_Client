import React, { useCallback } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import useMobx, { useModalContext } from '@app/stores/root-store';
import CONFIRMATION_MESSAGES from '@constants/confirmationMessages';

import TimelineItem from '@/models/timeline/chronology.model';

interface NewTimelineItemProps {
    timelineItem: TimelineItem;
    setModalOpened: React.Dispatch<React.SetStateAction<boolean>>;
    setEditTimelineItem: React.Dispatch<React.SetStateAction<TimelineItem | undefined>>;
    onChange: (field: string, value: any) => void;
}

const NewTimelineItem: React.FC<NewTimelineItemProps> = ({
    timelineItem,
    setModalOpened,
    setEditTimelineItem,
    onChange,
}) => {
    const { timelineItemStore } = useMobx();
    const { modalStore } = useModalContext();

    const handleRemove = useCallback(() => {
        modalStore.setConfirmationModal(
            'confirmation',
            () => {
                timelineItemStore.deleteTimelineFromMap(timelineItem.id);
                onChange('timelineItem', timelineItem);
            },
            CONFIRMATION_MESSAGES.DELETE_TIMELINE,
        );
    }, []);

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
                    <DeleteOutlined onClick={() => handleRemove()} />
                </div>
            </div>
        </div>
    );
};
export default NewTimelineItem;
