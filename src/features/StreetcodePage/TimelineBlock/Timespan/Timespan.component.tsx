import './Timespan.styles.scss';

import { observer } from 'mobx-react-lite';
import useMobx from '@stores/root-store';
import TimelineSwiper from '@streetcode/TimelineBlock/TimelineSwiper/TimelineSwiper.component';

const settings = {
    dots: true,
};

const TimelineTimespan = () => {
    const { timelineItemStore } = useMobx();
    const { getYearsArray, setActiveYear, getTimelineItemArray, setChangedByYear } = timelineItemStore;

    const middleIdx = Math.round((getYearsArray.length - 1) / 2);
    return (
        <div className="timeSpanContainer">
            <div className="timelineYearTicksContainer">
                <TimelineSwiper
                    slidesPerView={5}
                    initialSlide={middleIdx}
                    className="timelineYearTicksContainerSwiper"
                    {...settings}
                >
                    {getYearsArray.map((year, idx) => (
                        <div
                            key={idx}
                            className="timelineYearTick"
                            onClick={() => {
                                setActiveYear(year);
                                setChangedByYear(true);
                                console.log(year);
                            }}
                        >
                            <span>{year}</span>
                        </div>
                    ))}
                </TimelineSwiper>
            </div>
        </div>
    );
};

export default observer(TimelineTimespan);
