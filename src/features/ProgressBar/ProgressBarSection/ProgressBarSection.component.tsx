import './ProgressBarSection.styles.scss';

import { NamedBlock } from '@features/ProgressBar/NavigableBlockWrapper.component';

import { Popover } from 'antd';

interface Props {
    idx: number;
    block: NamedBlock;
    isBlockActive: boolean;
}

const ProgressBarSection = ({ idx, block: { title, height }, isBlockActive }: Props) => (
    <Popover
        overlayClassName="progressBarSectionPopover"
        align={{ offset: [0, 1] }}
        content={<p>{title}</p>}
    >
        <div
            key={idx}
            className={`progressBarSection ${isBlockActive ? 'active' : ''}`}
        >
            <span onClick={() => window.scrollTo(0, height)}>
                {idx + 1}
            </span>
        </div>
    </Popover>
);

export default ProgressBarSection;
