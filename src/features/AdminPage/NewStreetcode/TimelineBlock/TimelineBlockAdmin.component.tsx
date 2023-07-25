import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import useMobx from '@app/stores/root-store';
import TimelineItem from '@models/timeline/chronology.model';

import NewTimelineItem from './NewTimelineItem/NewTimelineItem.component';
import NewTimelineModal from './NewTimelineModal/NewTimelineModal.component';

interface Props {
    onChange: (field: string, value: any) => void;
}

const TimelineBlockAdmin = ({ onChange }: Props) => {
    const { timelineItemStore } = useMobx();
    const [isModalCreateOpen, setIsModalCreateOpen] = useState<boolean>(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState<boolean>(false);
    const [editedTimeline, setEditedTimeline] = useState<TimelineItem>();
    const showModal = () => {
        setIsModalCreateOpen(true);
    };

    return (
        <div className="adminContainer-block">
            <h2>Хронологія</h2>
            <div className="textBlockButton-container">
                <button
                    type="button"
                    className="buttonWithPlus"
                    onClick={showModal}
                >
                +
                </button>
                {timelineItemStore
                    .getTimelineItemArray
                    .map((ti) => (
                        <NewTimelineItem
                            key={`${ti.id}${ti.date.getFullYear}`}
                            timelineItem={ti}
                            setModalOpened={setIsModalEditOpen}
                            setEditTimelineItem={setEditedTimeline}
                            onChange={onChange}
                        />
                    ))}
            </div>
            <NewTimelineModal
                setIsModalOpen={setIsModalCreateOpen}
                open={isModalCreateOpen}
                onChange={onChange}
            />
            <NewTimelineModal
                setIsModalOpen={setIsModalEditOpen}
                open={isModalEditOpen}
                timelineItem={editedTimeline}
                onChange={onChange}
            />
        </div>
    );
};

export default observer(TimelineBlockAdmin);
