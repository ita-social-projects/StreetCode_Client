import React, { HTMLProps, ReactNode } from 'react';
import {
    DndContext, DragEndEvent, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';

type Props = {
    children: ReactNode;
} & HTMLProps<HTMLDivElement>;

const TodoDndContext: React.FC<Props> = ({ children, ...props }: Props) => {
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
        const droppableId = event?.over?.id || null;
        const draggbleId = event.active.id;

        console.log(droppableId, draggbleId);
    }
};

export default TodoDndContext;
