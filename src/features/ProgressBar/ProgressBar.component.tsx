import './ProgressBar.styles.scss';

import ArrowUp from '@images/utils/ArrowUp.svg';

import { useState } from 'react';
import NavigableBlockWrapper, { MeasuredBlock } from '@features/ProgressBar/NavigableBlockWrapper.component';
import useEventListener from '@hooks/external/useEventListener.hook';
import useScrollPosition from '@hooks/scrolling/useScrollPosition/useScrollPosition.hook';
import useToggle from '@hooks/stateful/useToggle.hook';

interface Props {
    children: JSX.Element[];
    waitMsOnRender?: number;
}

const getYScrollPercentage = (curPos: number, ofValue?: number) => {
    const elHeight = ofValue ?? document.documentElement.scrollHeight;
    return (curPos / elHeight) * 100;
};

const ProgressBar = ({ waitMsOnRender = 300, children }: Props) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [blocks, setBlocks] = useState<MeasuredBlock[]>([]);
    const { toggleState: isVisible, handlers: { toggle, off } } = useToggle();

    useScrollPosition(
        ({ currentPos }) => {
            setScrollPosition(Math.abs(currentPos.y));
        },
        [setScrollPosition],
        waitMsOnRender,
    );
    useEventListener('scroll', off, document);

    const totalHeight = blocks.reduce(
        (acc: number, cur, idx) => acc + ((idx === 0) ? cur.height * 2 : cur.height - blocks[idx - 1].height),
        0,
    );

    const scrollPercentage = getYScrollPercentage(scrollPosition, totalHeight)
        - getYScrollPercentage(blocks[0]?.height, totalHeight);

    console.log(totalHeight, scrollPosition, scrollPercentage, blocks.map((bl) => bl.height));

    return (
        <>
            <NavigableBlockWrapper setBlocks={setBlocks}>
                {children}
            </NavigableBlockWrapper>
            <div className="progressBarContainer" onClick={toggle}>
                <div className={`progressBarPopupContainer ${isVisible ? 'visible' : ''}`}>
                    <div className="progressBarPopupContent">
                        {blocks.map(({ id, height }, idx) => {
                            let isBlockActive = height < scrollPosition;
                            if (idx + 1 !== blocks.length) {
                                isBlockActive &&= scrollPosition < blocks[idx + 1].height;
                            }

                            // console.log(idx, height, scrollPosition, blocks[idx + 1]?.height, isBlockActive);

                            return (
                                <div key={id} className={`progressBarSection ${isBlockActive ? 'active' : ''}`}>
                                    <a href={`#${id}`}>
                                        {idx + 1}
                                    </a>
                                </div>
                            );
                        })}
                        <span
                            className="progressBarDashedFill"
                            style={(blocks.length < 5) ? { height: '70%' } : undefined}
                        />
                        <span
                            className="progressBarProgressFill"
                            style={{ background: `linear-gradient(to bottom, #8D1F16
                            ${scrollPercentage}%, transparent 0)` }}
                        />
                    </div>
                </div>
                <ArrowUp style={isVisible ? { rotate: 'x 180deg' } : undefined} />

            </div>
        </>
    );
};

export default ProgressBar;
