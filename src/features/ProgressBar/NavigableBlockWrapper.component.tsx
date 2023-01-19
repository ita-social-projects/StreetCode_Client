import { useRef } from 'react';
import useResizeObserver from '@react-hook/resize-observer';

interface Props {
    children: JSX.Element[];
    setHeights: (heights: number[]) => void;
    topDistance: number;
}

const NavigableBlockWrapper = ({ children, setHeights, topDistance }: Props) => {
    const parentRef = useRef<HTMLDivElement>(null);

    useResizeObserver(parentRef, (_) => {
        if (!parentRef.current) {
            return;
        }

        const blocks: number[] = [];
        Array.from(parentRef.current.children).forEach((child) => {
            blocks.push(
                (child as HTMLElement).offsetTop - topDistance,
            );
        });
        
        setHeights(blocks);
    });

    return (
        <div ref={parentRef}>
            {children}
        </div>
    );
};

export default NavigableBlockWrapper;
