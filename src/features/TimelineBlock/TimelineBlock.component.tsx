import './TimelineBlock.styles.scss';

import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import TimelineTimespan from '@features/TimelineBlock/Timespan/Timespan.component';
import TimelineItem from '@features/TimelineBlock/TimelineItem/TimelineItem.component';
import TimelineReelOutline from '@features/TimelineBlock/TimelineReelOutline/TimelineReelOutline.component';

const TimelineBlock = () => (
    <>
        <BlockHeading headingText={'Хронологія'} />
        <TimelineTimespan yearTicks={Array(7).fill(1894)} />
        <div className={'timelineContainer'}>
            <TimelineReelOutline />
            <div className={'timelineItemContainer'}>
                {Array(3).fill(0).map((_, idx) => (
                    <TimelineItem key={idx} />
                ))}
            </div>
            <TimelineReelOutline />
        </div>
    </>
);

export default TimelineBlock;