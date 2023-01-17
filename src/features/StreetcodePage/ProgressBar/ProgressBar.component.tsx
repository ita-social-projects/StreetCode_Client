import './ProgressBar.styles.scss';

import ArrowUp from '@images/utils/ArrowUp.svg';

import { useState } from 'react';
import useScrollPosition from '@hooks/scrolling/useScrollPosition/useScrollPosition.hook';
import useToggle from '@hooks/stateful/useToggle.hook';

interface Props {
    sections?: number;
    waitMsOnRender?: number;
}

const ProgressBar = ({ sections = 7, waitMsOnRender = 30 }: Props) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const { toggleState: isActive, handlers: { toggle } } = useToggle();

    useScrollPosition(
        ({ currentPos }) => {
            const docHeight = document.documentElement.scrollHeight;
            const pageScrollPercentage = (Math.abs(currentPos.y) / docHeight) * 100;

            setScrollPosition(pageScrollPercentage);
        },
        [setScrollPosition],
        waitMsOnRender,
    );

    console.log(scrollPosition);

    return (
        <div className="progressBarContainer" onClick={toggle}>
            <div className={`progressBarPopupContainer ${isActive ? 'active' : ''}`}>
                <div className="progressBarPopupContent">
                    {Array.from(new Array(sections), (_, idx) => idx + 1).map((el) => (
                        <div key={el} className="progressBarSection">
                            <span>{el}</span>
                        </div>
                    ))}
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
