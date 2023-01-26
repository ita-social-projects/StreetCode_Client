import './TimelineBlock.styles.scss';

import { observer } from 'mobx-react-lite';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { useRouteId } from '@hooks/stateful/useRouter.hook';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import TimelineSlideCard from '@streetcode/TimelineBlock/TimelineItem/TimelineItem.component';
import TimelineReelOutline from '@streetcode/TimelineBlock/TimelineReelOutline/TimelineReelOutline.component';
import TimelineTimespan from '@streetcode/TimelineBlock/Timespan/Timespan.component';

const TimelineBlock = () => {
    const { timelineItemStore } = useMobx();
    const { fetchTimelineItemsByStreetcodeId, getTimelineItemArray } = timelineItemStore;

    const streetcodeId = useRouteId();
    useAsync(
        () => fetchTimelineItemsByStreetcodeId(streetcodeId),
        [streetcodeId],
    );

    return (
        <div className="timelineContainer">
            <BlockHeading headingText="Хронологія" />
            <TimelineTimespan />
            <div className="timelineContentContainer">
                <TimelineReelOutline />
                <BlockSlider
                    arrows={false}
                    swipeOnClick
                    swipeToSlide
                    centerMode
                    // initialSlide={1}
                    centerPadding="-6px"
                >
                    {getTimelineItemArray.map((timelineItem) => (
                        <TimelineSlideCard
                            key={timelineItem.id}
                            timelineItem={timelineItem}
                        />
                    ))}
                </BlockSlider>
                <TimelineReelOutline />
            </div>
        </div>
    );
};

export default observer(TimelineBlock);
