import './ProgressBar.styles.scss';

import ArrowUp from '@images/utils/ArrowUp.svg';

import { useRef, useState } from 'react';
import NavigableBlockWrapper, { NamedBlock } from '@features/ProgressBar/NavigableBlockWrapper.component';
import ProgressBarFill from '@features/ProgressBar/ProgressBarFill/ProgressBarFill.component';
import ProgressBarSection from '@features/ProgressBar/ProgressBarSection/ProgressBarSection.component';
import useScrollPosition from '@hooks/scrolling/useScrollPosition/useScrollPosition.hook';

interface Props {
    children: JSX.Element[];
    waitMsOnRender?: number;
    topDistance?: number;
    alwaysVisibleBeforePx?: number;
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

const useForceUpdate = () => {
    const [, setValue] = useState(0);
    return () => setValue((prev) => prev + 1);
};

const ProgressBar = ({ children, waitMsOnRender = 300, topDistance = 200, alwaysVisibleBeforePx = 1600 }: Props) => {
    const scrollPercentage = useRef(0);
    const isScrollInFirstTwoSections = useRef(true);

    const forceUpdate = useForceUpdate();
    const [blocks, setBlocks] = useState<NamedBlock[]>([]);
    const [scrollPosition, setScrollPosition] = useState(0);

    const [isOnTimeout, setIsOnTimeout] = useState(true);
    const timer = 3000;
    let timeout: NodeJS.Timeout | undefined;

    function stopTimer(): void {
        clearTimeout(timeout);
    }

    function closeProgressBar() {
        setIsOnTimeout(false);
    }

    function renewTimer() {
        setIsOnTimeout(true);
        timeout = setTimeout(closeProgressBar, timer);
    }

    useScrollPosition(
        ({ currentPos }) => {
            const scrollY = Math.abs(currentPos.y);

            setScrollPosition(scrollY);
            isScrollInFirstTwoSections.current = scrollY <= alwaysVisibleBeforePx;
        },
        waitMsOnRender,
        [setScrollPosition],
    );

    const onActiveBlockSelection = (activeIdx: number) => {
        const blockPercentage = 100 / Math.max((blocks.length - 1), 1);

        const blockDifPercentage = getYScrollPercentage(
            scrollPosition,
            blocks[activeIdx].height,
            blocks[activeIdx + 1]?.height,
        );

        scrollPercentage.current = (activeIdx * blockPercentage)
            + (blockDifPercentage * (blockPercentage / 100));
    };

    const onProgressBarCallerClick = () => {
        if (isScrollInFirstTwoSections.current) {
            forceUpdate();
            setIsOnTimeout(false);
        } else {
            renewTimer();
        }
        isScrollInFirstTwoSections.current = false;
    };

    const checkToCloseProgressBar = isScrollInFirstTwoSections.current || isOnTimeout;

    return (
        <>
            <NavigableBlockWrapper setBlocks={setBlocks} topDistance={topDistance}>
                {children}
            </NavigableBlockWrapper>
            <div
                className="progressBarContainer"
                onClick={onProgressBarCallerClick}
            >
                <div
                    className={`progressBarPopupContainer
                    ${checkToCloseProgressBar ? 'visible' : ''}`}
                    onMouseEnter={stopTimer}
                    onMouseLeave={renewTimer}
                >
                    <div className="progressBarPopupContent">
                        {blocks.map((block, idx) => {
                            let isBlockActive = block.height <= scrollPosition;

                            if (scrollPosition === 0 && idx === 0) {
                                isBlockActive = true;
                            } else if (idx + 1 !== blocks.length) {
                                isBlockActive &&= scrollPosition < blocks[idx + 1].height;
                            }

                            if (isBlockActive) {
                                onActiveBlockSelection(idx);
                            }

                            return (
                                <ProgressBarSection
                                    idx={idx}
                                    block={block}
                                    isBlockActive={isBlockActive}
                                />
                            );
                        })}
                        <ProgressBarFill
                            blocksLength={blocks.length}
                            fillPercentage={scrollPercentage.current}
                        />
                    </div>
                </div>
                <ArrowUp
                    style={checkToCloseProgressBar ? { rotate: 'x 180deg' } : undefined}
                />
            </div>
        </>
    );
};

export default ProgressBar;
