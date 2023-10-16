import './Draggable.styles.scss';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

type Props = {
    children: React.ReactNode;
    id: string;
};

const Draggable: React.FC<Props> = ({ children, id }: Props) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="draggable"
        >
            {children}
        </div>
    );
};
export default Draggable;
