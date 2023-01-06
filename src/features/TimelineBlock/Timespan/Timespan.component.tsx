import './Timespan.styles.scss';
import React from 'react';

interface Props {
    yearTicks: Array<number | string>;
}

const TimelineTimespan = ({ yearTicks }: Props) => {
    const middleIdx = yearTicks[Math.round((yearTicks.length - 1) / 2)];

    return (
        <div className={'timeSpanContainer'}>
            <div className={'timelineYearTicksContainer'}>
                {yearTicks.map((year, idx) => (
                    <div key={idx} className={'timelineYearTick'}>
                        <span style={((middleIdx === idx) ? {} : undefined)}>
                            {year}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimelineTimespan;