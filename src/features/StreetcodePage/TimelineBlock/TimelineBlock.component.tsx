import './TimelineBlock.styles.scss';

import { observer } from 'mobx-react-lite';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { useRouteId } from '@hooks/stateful/useRouter.hook';
import useMobx from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import TimelineSlideCard from '@streetcode/TimelineBlock/TimelineItem/TimelineItem.component';
import TimelineReelOutline from '@streetcode/TimelineBlock/TimelineReelOutline/TimelineReelOutline.component';
import TimelineSlider from '@streetcode/TimelineBlock/TimelineSlider.component';
import TimelineTimespan from '@streetcode/TimelineBlock/Timespan/Timespan.component';

const TimelineBlock = () => {
    const { timelineItemStore } = useMobx();
    const { fetchTimelineItemsByStreetcodeId, getTimelineItemArray } = timelineItemStore;

    const streetcodeId = useRouteId();
    useAsync(
        () => fetchTimelineItemsByStreetcodeId(streetcodeId),
        [streetcodeId],
    );

    function getSlidesToShowNumber(): number {
        let windowWidth: number = window.outerWidth;
        console.log(windowWidth);

        if (windowWidth > 1600) {
            windowWidth = 1600;
        }
        if (windowWidth > 1400) {
            return windowWidth / 658.0;
        }
        if (windowWidth > 1200) {
            return windowWidth / 665.0;
        }
        if (windowWidth > 800) {
            return windowWidth / 630.0;
        }
        return 1;
    }
    return (
        <div className="timelineContainer">
            <BlockHeading headingText="Хронологія" />
            <TimelineTimespan />
            <div className="timelineContentContainer">
                <TimelineReelOutline />
                <TimelineSlider
                    dots={false}
                    arrows={false}
                    swipeToSlide
                    swipeOnClick
                    centerMode
                    slidesToShow={getSlidesToShowNumber()}
                    infinite
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
    );
};

export default observer(TimelineBlock);
