import React, { useCallback, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import useMobx from '@app/stores/root-store';

import { Modal } from 'antd';

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
    const [visibleModal, setVisibleModal] = useState(false);
    const handleRemove = useCallback(() => {
        setVisibleModal(true);
    }, []);

    const handleCancelModalRemove = useCallback(() => {
        setVisibleModal(false);
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
                <Modal
                    title="Ви впевнені, що хочете видалити цей таймлайн?"
                    open={visibleModal}
                    onOk={(e) => {
                        timelineItemStore.deleteTimelineFromMap(timelineItem.id); setVisibleModal(false);
                        onChange('timelineItem', timelineItem);
                    }}
                    onCancel={handleCancelModalRemove}
                />
            </div>
        </div>
    );
};
export default NewTimelineItem;
