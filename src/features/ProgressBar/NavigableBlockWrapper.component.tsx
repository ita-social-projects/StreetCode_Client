import useResizeObserver from '@react-hook/resize-observer';
import { useRef } from 'react';

export type NamedBlock = {
    title: string,
    height: number,
};

interface Props {
    children: JSX.Element[];
    setBlocks: (blocks: NamedBlock[]) => void;
    topDistance: number;
}

const NavigableBlockWrapper = ({ children, setBlocks, topDistance }: Props) => {
    const parentRef = useRef<HTMLDivElement>(null);

    useResizeObserver(parentRef, () => {
        if (!parentRef.current) {
            return;
        }

        const blocks: NamedBlock[] = [];
        Array.from(parentRef.current.children).forEach((child, idx) => {
            const headerBlock = Array.from(child.getElementsByTagName('h1'))
                .find(({ className }) => className.trim() === 'blockHeadingText')
             ?? Array.from(child.getElementsByTagName('h2'))
                 .find(({ className }) => className === 'streetcodeTitle');

            blocks.push({
                title: headerBlock?.textContent ?? `Секція №${idx + 1}`,
                height: (child as HTMLElement).offsetTop - topDistance,
            } as NamedBlock);
        });

        setBlocks(blocks);
    });

    return (
        <div ref={parentRef}>
            {children}
        </div>
    );
};

export default NavigableBlockWrapper;
