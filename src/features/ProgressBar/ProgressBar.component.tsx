import './ProgressBar.styles.scss';

import ArrowUp from '@images/utils/ArrowUp.svg';

import { useState } from 'react';
import { MeasuredBlock } from '@features/ProgressBar/block-wrappers/StreetcodePageWrapper.component';
import useEventListener from '@hooks/external/useEventListener.hook';
import useScrollPosition from '@hooks/scrolling/useScrollPosition/useScrollPosition.hook';
import useToggle from '@hooks/stateful/useToggle.hook';

interface Props {
    blocks: MeasuredBlock[];
    waitMsOnRender?: number;
}

const getYScrollPercentage = (curPos: number, ofValue?: number) => {
    const elHeight = ofValue ?? document.documentElement.scrollHeight;
    return (curPos / elHeight) * 100;
};

const ProgressBar = ({ waitMsOnRender = 50, blocks }: Props) => {
    const [scrollPosition, setScrollPosition] = useState(0);
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
        (acc: number, cur, idx) => acc
            + ((idx === 0) ? cur.height * 2 : cur.height - blocks[idx - 1].height),
        0,
    );

    const scrollPercentage = getYScrollPercentage(scrollPosition, totalHeight);
    const progressFillStyle = {
        background: `linear-gradient(to bottom, #8D1F16
            ${scrollPercentage * 0.8}%, transparent 0)`,
    };

    return (
        <div className="progressBarContainer" onClick={toggle}>
            <div className={`progressBarPopupContainer ${isVisible ? 'visible' : ''}`}>
                <div className="progressBarPopupContent">
                    {blocks.map(({ id, height }, idx) => {
                        let isBlockActive = height < scrollPosition;
                        if (idx + 1 !== blocks.length) {
                            isBlockActive &&= scrollPosition < blocks[idx + 1].height;
                        }

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
                        style={progressFillStyle}
                    />
                </div>
            </div>
            <ArrowUp style={isVisible ? { rotate: 'x 180deg' } : undefined} />
        </div>
    );
};

export default ProgressBar;
