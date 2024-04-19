import './Droppable.styles.scss';

import React, { HTMLProps, ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

type Props = {
    children: ReactNode;
    id: string;
    className?: string;
} & HTMLProps<HTMLDivElement>;

const Droppable: React.FC<Props> = ({ children, className, id, ...props }: Props) => {
    const { isOver, setNodeRef } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`droppable ${className || ''}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Droppable;
