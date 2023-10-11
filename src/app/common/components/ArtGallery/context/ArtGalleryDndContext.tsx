import React, { HTMLProps, ReactNode } from 'react';
import {
    DndContext, DragEndEvent, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import Art from '@models/media/art.model';
import useMobx from '@stores/root-store';

type Props = {
    children: ReactNode;
} & HTMLProps<HTMLDivElement>;

const TodoDndContext: React.FC<Props> = ({ children, ...props }: Props) => {
    const { artStore, artGalleryTemplateStore } = useMobx();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 4,
            },
        }),
    );

    return (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        <DndContext onDragEnd={onDragEnd} sensors={sensors} {...props}>
            {children}
        </DndContext>
    );

    function onDragEnd(event: DragEndEvent): void {
        const droppableComplexId = event?.over?.id.toString() || null;
        const draggbleId = parseInt(event.active.id as string, 10);

        if (!draggbleId || !droppableComplexId) return;

        const slideId = parseInt(droppableComplexId.split('-')[0], 10);
        const artIndex = parseInt(droppableComplexId.split('-')[1], 10);

        const art = artStore.arts.find((art) => art.id === draggbleId);

        if (art) {
            artGalleryTemplateStore.setArtInSlide(slideId, artIndex, art as Art);
        } else {
            console.log('No art Found');
        }
    }
};

export default TodoDndContext;
