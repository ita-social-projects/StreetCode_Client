import './ProgressBar.styles.scss';

import ArrowUp from '@images/utils/ArrowUp.svg';

import {
    FC, useEffect, useMemo, useRef, useState,
} from 'react';
import NavigableBlockWrapper, { NamedBlock } from '@features/ProgressBar/NavigableBlockWrapper.component';
import ProgressBarFill from '@features/ProgressBar/ProgressBarFill/ProgressBarFill.component';
import ProgressBarSection from '@features/ProgressBar/ProgressBarSection/ProgressBarSection.component';
import useScrollPosition from '@hooks/scrolling/useScrollPosition/useScrollPosition.hook';
import useToggle from '@hooks/stateful/useToggle.hook';

interface Props {
    children: JSX.Element[];
    waitMsOnRender?: number;
    topDistance?: number;
    visibleBefore?: number;
    hidingDelay?: number;
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

const ProgressBar: FC<Props> = ({
    children,
    waitMsOnRender = 300,
    topDistance = 82,
    visibleBefore = 1600,
    hidingDelay = 10e3,
}) => {
    const wasScrolled = useRef(false);
    const scrollPercentage = useRef(0);
    const isScrollInFirstTwoSections = useRef(true);
    const [isProgressBarInUse, setProgressBarUse] = useState(false);

    const [blocks, setBlocks] = useState<NamedBlock[]>([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const {
        toggleState: isVisible,
        handlers: { toggle, off: setInvisible },
    } = useToggle(true);

    const timeoutId = useRef<NodeJS.Timeout>();
    const [isOnTimeout, setIsOnTimeout] = useState(true);

    useScrollPosition(
        ({ currentPos: { y } }) => {
            const curScrollY = Math.abs(y);

            setScrollPosition(curScrollY);

            wasScrolled.current = curScrollY > visibleBefore;
        },
        waitMsOnRender,
        [setScrollPosition],
    );

    useEffect(() => {
        if (wasScrolled.current && !isProgressBarInUse) {
            setInvisible();
            isScrollInFirstTwoSections.current = false;
        }
    }, [wasScrolled.current, setInvisible]);

    useEffect(() => {
        timeoutId.current = setTimeout(() => setIsOnTimeout(false), hidingDelay);
        return () => clearTimeout(timeoutId.current);
    }, []);

    const cursorCaptureHandlers = useMemo(() => ({
        onMouseOver: () => {
            clearTimeout(timeoutId.current);
            setIsOnTimeout(true);
            setProgressBarUse(true);
        },
        onMouseLeave: () => {
            setProgressBarUse(false);
            timeoutId.current = setTimeout(() => {
                setIsOnTimeout(false);
                toggle();
            }, hidingDelay);
        },
    }), [hidingDelay]);

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
        toggle();
        setIsOnTimeout(true);
        isScrollInFirstTwoSections.current = false;
    };

    const isPBVisible = (isScrollInFirstTwoSections.current || isVisible) && isOnTimeout;

    return (
        <>
            <NavigableBlockWrapper setBlocks={setBlocks} topDistance={topDistance}>
                {children}
            </NavigableBlockWrapper>
            <div className="progressBarContainer" onClick={onProgressBarCallerClick}>
                <div
                    {...cursorCaptureHandlers}
                    style={(!isOnTimeout) ? { pointerEvents: 'none' } : undefined}
                    className={`progressBarPopupContainer ${isPBVisible ? 'visible' : ''}`}
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
                                    key={idx}
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
                <ArrowUp style={isPBVisible ? { rotate: 'x 180deg' } : undefined} />
            </div>
        </>
    );
};

export default ProgressBar;
