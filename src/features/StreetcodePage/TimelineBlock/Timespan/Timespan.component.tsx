import './Timespan.styles.scss';

import React from 'react';
import TimelineSwiper from '@streetcode/TimelineBlock/TimelineSwiper/TimelineSwiper.component';

interface Props {
    yearTicks: Array<number | string>;
}

const TimelineTimespan = ({ yearTicks }: Props) => {
    const middleIdx = Math.round((yearTicks.length - 1) / 2);

    return (
        <div className="timeSpanContainer">
            <div className="timelineYearTicksContainer">
                <TimelineSwiper
                    slidesPerView={7}
                    initialSlide={middleIdx}
                    slideToClickedSlide
                >
                    {yearTicks.map((year, idx) => (
                        <div key={idx} className="timelineYearTick">
                            <span>{year}</span>
                        </div>
                    ))}
                </TimelineSwiper>
            </div>
        </div>
    );
};

export default TimelineTimespan;
