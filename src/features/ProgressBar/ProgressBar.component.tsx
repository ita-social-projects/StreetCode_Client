import './ProgressBar.styles.scss';

import ArrowUp from '@images/utils/ArrowUp.svg';

import { useEffect, useRef, useState } from 'react';
import NavigableBlockWrapper, { MeasuredBlock } from '@features/ProgressBar/NavigableBlockWrapper.component';
import useEventListener from '@hooks/external/useEventListener.hook';
import useScrollPosition from '@hooks/scrolling/useScrollPosition/useScrollPosition.hook';
import useToggle from '@hooks/stateful/useToggle.hook';

interface Props {
    children: JSX.Element[];
    waitMsOnRender?: number;
}

const getYScrollPercentage = (curPos: number, ofValue?: number, minValue?: number, maxValue?: number) => {
    const elMin = minValue ?? 0;
    const elMax = maxValue ?? document.documentElement.scrollHeight;
    const elHeight = ofValue ?? elMax - elMin;

    if (ofValue)
        return (curPos / elHeight) * 100;
    else {
        if (curPos < elMin)
            return elMin * 100 / elHeight;
        if (curPos > elMax)
            return elMax * 100 / elHeight;
        return (curPos - elMin) * 100 / elHeight;
    }
};

const ProgressBar = ({ waitMsOnRender = 300, children }: Props) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [blocks, setBlocks] = useState<MeasuredBlock[]>([]);
    const { toggleState: isVisible, handlers: { toggle, off } } = useToggle();
    const [activeIdx, setActiveIdx] = useState(-1);
    const progressFillRef = useRef<HTMLDivElement>(null);
    let scrollPercentage = 0;

    useEffect(
        ()=>console.log(progressFillRef.current)
        ,[progressFillRef.current, progressFillRef]
    )

    useScrollPosition(
        ({ currentPos }) => {
            setScrollPosition(Math.abs(currentPos.y));
        },
        [setScrollPosition],
        waitMsOnRender,
    );

    //useEventListener('scroll', off, document);

    const totalHeight = blocks.reduce(
        (acc: number, cur, idx) => acc + ((idx === 0) ? 0 : cur.height - blocks[idx - 1].height),
        0,
    );

    return (
        <>
            <NavigableBlockWrapper setBlocks={setBlocks}>
                {children}
            </NavigableBlockWrapper>
            <div className="progressBarContainer" onClick={toggle}>
                <div className={`progressBarPopupContainer ${isVisible ? 'visible' : ''}`}>
                    <div className="progressBarPopupContent">
                        {blocks.map(({ id, height }, idx) => {
                            const blockPercentage = 100 / Math.max( (blocks.length - 1), 1 );
                            let isBlockActive = height < scrollPosition;
                            
                            if (idx + 1 !== blocks.length) {
                                isBlockActive &&= scrollPosition < blocks[idx + 1].height;
                            }

                            if(isBlockActive){
                                scrollPercentage = getYScrollPercentage( scrollPosition, undefined, blocks[idx].height, blocks[idx+1]?.height);
                                scrollPercentage = ( idx * blockPercentage ) + ( scrollPercentage * blockPercentage / 100 );
                            }

                            return (
                                <div key={id} ref={progressFillRef} className={`progressBarSection ${isBlockActive ? 'active' : ''}`}>
                                    <a href={`#${id}`} onClick={() => {scrollPercentage = idx * blockPercentage}}>
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
