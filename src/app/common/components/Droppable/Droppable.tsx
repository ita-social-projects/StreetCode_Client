import React, { HTMLProps, ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

type Props = {
    children: ReactNode;
    id: string;
} & HTMLProps<HTMLDivElement>;

const Droppable: React.FC<Props> = ({ children, id, ...props }: Props) => {
    const { isOver, setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} {...props}>
            {children}
        </div>
    );
};

export default Droppable;
