import './TimelineBlock.styles.scss';

import SimpleSlider from '@features/SlickSlider/SlickSlider.component';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import TimelineItem from '@streetcode/TimelineBlock/TimelineItem/TimelineItem.component';
import TimelineReelOutline from '@streetcode/TimelineBlock/TimelineReelOutline/TimelineReelOutline.component';
import TimelineTimespan from '@streetcode/TimelineBlock/Timespan/Timespan.component';

// <div className="timelineItemContainer">

const TimelineBlock = () => (
    <div className="timelineContainer">
        <BlockHeading headingText="Хронологія" />
        <TimelineTimespan yearTicks={Array(7).fill(1894)} />
        <div className="timelineContentContainer">
            <TimelineReelOutline />
            <SimpleSlider
                dots={false}
                arrows={false}
                swipe
                slides={
                    Array(6).fill(0).map((_, idx) => (
                        <TimelineItem key={idx} />
                    ))
                }
            />
            <TimelineReelOutline />
        </div>
    </div>
);

export default TimelineBlock;
