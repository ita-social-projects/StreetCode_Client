import React, { HTMLProps, ReactNode } from 'react';
import {
    DndContext, DragEndEvent, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import useMobx from '@stores/root-store';

type Props = {
    children: ReactNode;
} & HTMLProps<HTMLDivElement>;

const TodoDndContext: React.FC<Props> = ({ children, ...props }: Props) => {
    const { streetcodeArtStore, artGalleryTemplateStore } = useMobx();

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
        const draggbleId = event?.over?.id || null;
        const droppableId = event.active.id;
        console.log(droppableId, draggbleId);

        const art = streetcodeArtStore.getStreetcodeArtArray.find((sArt) => sArt.art.id == draggbleId);
        if (art) {
            artGalleryTemplateStore.setArtInSlide(draggbleId, 1, art.art);
        } else {
            console.log('No art Found');
        }
    }
};

export default TodoDndContext;
