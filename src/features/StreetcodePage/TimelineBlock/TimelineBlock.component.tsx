import './TimelineBlock.styles.scss';

import { observer } from 'mobx-react-lite';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx, { useStreetcodeDataContext } from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import TimelineSlideCard from '@streetcode/TimelineBlock/TimelineItem/TimelineItem.component';
import TimelineReelOutline from '@streetcode/TimelineBlock/TimelineReelOutline/TimelineReelOutline.component';
import TimelineSlider from '@streetcode/TimelineBlock/TimelineSlider.component';
import TimelineTimespan from '@streetcode/TimelineBlock/Timespan/Timespan.component';

const TimelineBlock = () => {
    const { timelineItemStore } = useMobx();
    const { fetchTimelineItemsByStreetcodeId, getTimelineItemArray, activeYear } = timelineItemStore;
    const { streetcodeStore: { getStreetCodeId, errorStreetCodeId } } = useStreetcodeDataContext();

    useAsync(
        () => {
            if (getStreetCodeId !== errorStreetCodeId) {
                fetchTimelineItemsByStreetcodeId(getStreetCodeId).then(() => {
                    const years = timelineItemStore.getYearsArray;
                    timelineItemStore.setActiveYear(years[Math.floor(years.length / 2)]);
                });
            }
        },
        [getStreetCodeId],
    );

    return (
        (getTimelineItemArray.length > 0)
            ? (
                <div
                    id="timeline"
                    className="timelineContainer container"
                >
                    <BlockHeading headingText="Хронологія" />
                    <TimelineTimespan />
                    <div className="timelineContentContainer">
                        <TimelineReelOutline />
                        <TimelineSlider
                            dots={false}
                            arrows={false}
                            centerMode
                            swipeOnClick
                            infinite={false}
                            variableWidth
                            swipeToSlide
                            slidesToScroll={1}
                        >
                            {getTimelineItemArray.map((timelineItem) => (
                                <TimelineSlideCard
                                    key={timelineItem.id}
                                    timelineItem={timelineItem}
                                />
                            ))}
                        </TimelineSlider>
                        <TimelineReelOutline />
                    </div>
                </div>
            ) : <></>
    );
};

export default observer(TimelineBlock);
