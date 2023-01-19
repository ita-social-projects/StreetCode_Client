import { useLayoutEffect, useRef, useState } from 'react';

export type MeasuredBlock = {
    id: string,
    height: number,
};

interface Props {
    children: JSX.Element[],
    setBlocks: (blocks: MeasuredBlock[]) => void,
}

const NavigableBlockWrapper = ({ children, setBlocks, }: Props) => {
    const parentRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const blocks: MeasuredBlock[] = [];

        parentRef.current?.childNodes.forEach((node) => {
            const elementNode = node as Element;
            blocks.push({
                id: elementNode?.getAttribute('id'),
                height: (elementNode as HTMLElement)?.offsetTop,
            } as MeasuredBlock);
        });

        setBlocks(blocks);
    }, [setBlocks]);

    return (
        <div ref={parentRef}>
            {children}
        </div>
    );
};

export default NavigableBlockWrapper;
