/* eslint-disable import/extensions */
import './TimelineBlockAdmin.style.scss';

import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';

import useMobx from '@/app/stores/root-store';
import TimelineItem from '@/models/timeline/chronology.model';

import NewTimelineItem from './NewTimelineItem/NewTimelineItem.component';
import NewTimelineModal from './NewTimelineModal/NewTimelineModal.component';

const TimelineBlockAdmin:React.FC = observer(() => {
    const { timelineItemStore } = useMobx();
    const [isModalCreateOpen, setIsModalCreateOpen] = useState<boolean>(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState<boolean>(false);
    const [editedTimeline, setEditedTimeline] = useState<TimelineItem>();
    const showModal = () => {
        setIsModalCreateOpen(true);
    };

    return (
        <div className="timeline-admin-container">
            <p>Хронологія</p>
            <div className="timeline-admin-new-items-container">
                <div
                    className="timeline-admin-item timeline-admin-add-new"
                    onClick={showModal}
                >
                +
                </div>
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
});

export default TimelineBlockAdmin;
