import './ProgressBarSection.styles.scss';

import { NamedBlock } from '@features/ProgressBar/NavigableBlockWrapper.component';

import { Popover } from 'antd';

interface Props {
    idx: number;
    block: NamedBlock;
    isBlockActive: boolean;
}

const ProgressBarSection = ({ idx, block: { title, height }, isBlockActive }: Props) => {
    const CurrentClick = (e: any) => {
        e.stopPropagation();
        window.scrollTo(0, height);
    };

    return (
        <Popover
            overlayClassName="progressBarSectionPopover"
            align={{ offset: [0, 1] }}
            content={<p>{title}</p>}
            getPopupContainer={(trigger:HTMLElement) => trigger.parentElement as HTMLElement}
        >
            <div
                key={idx}
                className={`progressBarSection ${isBlockActive ? 'active' : ''}`}
                onClick={CurrentClick}
            >
                <span>
                    {idx + 1}
                </span>
            </div>
        </Popover>
    );
};

export default ProgressBarSection;
