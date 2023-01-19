import './ProgressBar.styles.scss';

import ArrowUp from '@images/utils/ArrowUp.svg';

import { useRef, useState } from 'react';
import NavigableBlockWrapper from '@features/ProgressBar/NavigableBlockWrapper.component';
import ProgressBarFill from '@features/ProgressBar/ProgressBarFill/ProgressBarFill.component';
import useScrollPosition from '@hooks/scrolling/useScrollPosition/useScrollPosition.hook';
import useToggle from '@hooks/stateful/useToggle.hook';

interface Props {
    children: JSX.Element[];
    waitMsOnRender?: number;
    topDistance?: number;
}

const getPercentage = (value: number, ofValue: number) => (value * 1e2) / ofValue;

const getYScrollPercentage = (curPos: number, minValue?: number, maxValue?: number) => {
    const elMin = minValue ?? 0;
    const elMax = maxValue ?? document.documentElement.scrollHeight;
    const elHeight = elMax - elMin;

    return getPercentage(
        // eslint-disable-next-line no-nested-ternary
        (curPos < elMin) ? elMin
            : ((curPos > elMax) ? elMax : curPos - elMin),
        elHeight,
    );
};

const ProgressBar = ({ waitMsOnRender = 300, children, topDistance = 200 }: Props) => {
    const scrollPercentage = useRef(0);
    const [scrollPosition, setScrollPosition] = useState(0);

    const [heights, setHeights] = useState<number[]>([]);
    const { toggleState: isVisible, handlers: { toggle } } = useToggle();

    useScrollPosition(
        ({ currentPos }) => {
            setScrollPosition(Math.abs(currentPos.y));
        },
        [setScrollPosition],
        waitMsOnRender,
    );

    const onActiveBlockSelection = (activeIdx: number) => {
        const blockPercentage = 100 / Math.max((heights.length - 1), 1);

        const blockDifPercentage = getYScrollPercentage(
            scrollPosition,
            heights[activeIdx],
            heights[activeIdx + 1],
        );

        scrollPercentage.current = (activeIdx * blockPercentage)
            + (blockDifPercentage * (blockPercentage / 100));
    };

    return (
        <>
            <NavigableBlockWrapper setHeights={setHeights} topDistance={topDistance}>
                {children}
            </NavigableBlockWrapper>
            <div className="progressBarContainer" onClick={toggle}>
                <div className={`progressBarPopupContainer ${isVisible ? 'visible' : ''}`}>
                    <div className="progressBarPopupContent">
                        {heights.map((height, idx) => {
                            let isBlockActive = height <= scrollPosition;
                            
                            if (scrollPosition === 0 && idx === 0) {
                                isBlockActive = true;
                            } else if (idx + 1 !== heights.length) {
                                isBlockActive &&= scrollPosition < heights[idx + 1];
                            }

                            if (isBlockActive) {
                                onActiveBlockSelection(idx);
                            }

                            return (
                                <div
                                    key={idx}
                                    className={`progressBarSection ${isBlockActive ? 'active' : ''}`}
                                >
                                    <span onClick={() => window.scrollTo(0, height)}>
                                        {idx + 1}
                                    </span>
                                </div>
                            );
                        })}
                        <ProgressBarFill
                            blocksLength={heights.length}
                            fillPercentage={scrollPercentage.current}
                        />
                    </div>
                </div>
                <ArrowUp style={isVisible ? { rotate: 'x 180deg' } : undefined} />
            </div>
        </>
    );
};

export default ProgressBar;
