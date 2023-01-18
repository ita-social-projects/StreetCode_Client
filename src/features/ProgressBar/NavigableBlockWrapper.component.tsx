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
    //const [blockHeights, setBlockHeights] = useState<number[]>([]);

    useLayoutEffect(() => {
        const blocks: MeasuredBlock[] = [];

        parentRef.current?.childNodes.forEach((node) => {
            const elementNode = node as Element;
            blocks.push({
                id: elementNode?.getAttribute('id'),
                height: (elementNode as HTMLElement)?.offsetTop,
            } as MeasuredBlock);
            //setBlockHeights([ ...blockHeights , elementNode?.clientHeight ]);
        });

        setBlocks(blocks);
    }, [setBlocks, /*blockHeights*/]);

    return (
        <div ref={parentRef}>
            {children}
        </div>
    );
};

export default NavigableBlockWrapper;
