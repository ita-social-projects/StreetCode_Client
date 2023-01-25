import './TimelineBlock.styles.scss';

import { observer } from 'mobx-react-lite';
import BlockSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { useRouteId } from '@hooks/stateful/useRouter.hook';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import TimelineItem from '@streetcode/TimelineBlock/TimelineItem/TimelineItem.component';
import TimelineReelOutline from '@streetcode/TimelineBlock/TimelineReelOutline/TimelineReelOutline.component';
import TimelineTimespan from '@streetcode/TimelineBlock/Timespan/Timespan.component';

const TimelineBlock = () => {
    const { timelineItemStore } = useMobx();
    const { fetchTimelineItemsByCategoryId, getYearsArray, getTimelineItemArray } = timelineItemStore;

    const streetcodeId = useRouteId();
    useAsync(
        () => fetchTimelineItemsByCategoryId(streetcodeId),
        [streetcodeId],
    );

    console.log(getTimelineItemArray);
    console.log(getYearsArray);

    return (
        <div className="timelineContainer">
            <BlockHeading headingText="Хронологія" />
            <TimelineTimespan yearTicks={getYearsArray} />
            <div className="timelineContentContainer">
                <TimelineReelOutline />
                <BlockSlider
                    arrows={false}
                    swipeToSlide
                    swipeOnClick
                    centerMode
                    centerPadding="-6px"
                >
                    {getTimelineItemArray?.map((ti) => (
                        <TimelineItem key={ti.id} />
                    ))}
                </BlockSlider>
                <TimelineReelOutline />
            </div>
        </div>
    );
};

export default observer(TimelineBlock);
