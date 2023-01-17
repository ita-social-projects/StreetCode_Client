import './ProgressBar.styles.scss';

import ArrowUp from '@images/utils/ArrowUp.svg';

import { useEffect, useState } from 'react';
import useEventListener from '@hooks/external/useEventListener.hook';
import useScrollPosition from '@hooks/scrolling/useScrollPosition/useScrollPosition.hook';
import useToggle from '@hooks/stateful/useToggle.hook';
import { MeasuredBlock } from '@features/ProgressBar/block-wrappers/StreetcodePageWrapper.component';
import { toast } from 'react-toastify';

interface Props {
    blocks: MeasuredBlock[];
    waitMsOnRender?: number;
}

const ProgressBar = ({ waitMsOnRender = 30, blocks }: Props) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [scrollPositionPx, setScrollPositionPx] = useState(0);
    const [activeBlockIdx, setActiveBlockIdx] = useState(-1);
    const { toggleState: isActive, handlers: { toggle, off } } = useToggle();

    useScrollPosition(
        ({ currentPos }) => {
            const docHeight = document.documentElement.scrollHeight;
            const pageScrollPercentage = (Math.abs(currentPos.y) / docHeight) * 100;

            setScrollPosition(pageScrollPercentage);
            setScrollPositionPx(currentPos.y);
        },
        [setScrollPosition],
        waitMsOnRender,
    );

    useEventListener('scroll', off, document);

    return (
        <div className="progressBarContainer" onClick={toggle}>
            <div className={`progressBarPopupContainer ${isActive ? 'active' : ''}`}>
                <div className="progressBarPopupContent">
                    {blocks.map(({ id, height }, idx) => {
                        if (activeBlockIdx === -1) {
                            setActiveBlockIdx(idx);
                        }
                        return (
                            <div key={id} className={`progressBarSection ${activeBlockIdx === idx ? 'active' : ''}`}>
                                <a href={`#${id}`}>
                                    <span>{idx + 1}</span>
                                </a>
                            </div>
                        );
                    })}
                    <span className="progressBarDashedFill" />
                    <div
                        className="progressBarProgressFill"
                        style={{ background: `linear-gradient(to bottom, #8D1F16 ${scrollPosition}%, transparent 0)` }}
                    />
                </div>
            </div>
            <ArrowUp />
        </div>
    );
};

export default ProgressBar;
