/* eslint-disable import/extensions */
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';

import useMobx from '@/app/stores/root-store';
import TimelineItem from '@/models/timeline/chronology.model';

import NewTimelineItem from './NewTimelineItem/NewTimelineItem.component';
import NewTimelineModal from './NewTimelineModal/NewTimelineModal.component';
interface Props {
    timeline: TimelineItem[];
    setTimeline: React.Dispatch<React.SetStateAction<TimelineItem[]>>;
}
const TimelineBlockAdmin = ({ timeline, setTimeline }: Props)=> {
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
                        />
                    ))}
            </div>
            <NewTimelineModal
                setIsModalOpen={setIsModalCreateOpen}
                open={isModalCreateOpen}
            />
            <NewTimelineModal
                setIsModalOpen={setIsModalEditOpen}
                open={isModalEditOpen}
                timelineItem={editedTimeline}

            />
        </div>
    );
};

export default observer(TimelineBlockAdmin);
