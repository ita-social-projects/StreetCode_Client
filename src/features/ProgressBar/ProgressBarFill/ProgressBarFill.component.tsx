import './ProgressBarFill.styles.scss';

import { CSSProperties } from 'react';

interface Props {
    blocksLength: number;
    fillStyle?: CSSProperties;
    fillPercentage: number | string;
}

const ProgressBarFill = ({ blocksLength, fillPercentage, fillStyle }: Props) => (
    <>
        <span
            className="progressBarDashedFill"
            style={(blocksLength < 5) ? { height: '70%' } : undefined}
        />
        <span
            className="progressBarProgressFill"
            style={fillStyle ?? {
                background: `linear-gradient(to bottom, #8D1F16 ${fillPercentage}%, transparent 0)`,
            }}
        />
    </>
);

export default ProgressBarFill;
