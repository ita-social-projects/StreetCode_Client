import './TimelineBlock.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx, { useStreecodePageLoaderContext, useStreetcodeDataContext } from '@stores/root-store';
import BlockHeading from '@streetcode/HeadingBlock/BlockHeading.component';
import TimelineSlideCard from '@streetcode/TimelineBlock/TimelineItem/TimelineItem.component';
import TimelineReelOutline from '@streetcode/TimelineBlock/TimelineReelOutline/TimelineReelOutline.component';
import TimelineSlider from '@streetcode/TimelineBlock/TimelineSlider.component';
import TimelineTimespan from '@streetcode/TimelineBlock/Timespan/Timespan.component';

import getUrlHash from '@/app/common/utils/getUrlHash.utility';
import StreetcodeBlock from '@/models/streetcode/streetcode-blocks.model';

const TimelineBlock = () => {
    const { timelineItemStore } = useMobx();
    const streecodePageLoaderContext = useStreecodePageLoaderContext();
    const { fetchTimelineItemsByStreetcodeId, getTimelineItemArray } = timelineItemStore;
    const { streetcodeStore: { getStreetCodeId, errorStreetCodeId } } = useStreetcodeDataContext();
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    useAsync(
        () => {
            if (getStreetCodeId !== errorStreetCodeId) {
                fetchTimelineItemsByStreetcodeId(getStreetCodeId).then(() => {
                    const years = timelineItemStore.getYearsArray;
                    timelineItemStore.setActiveYear(years[Math.floor(years.length / 2)]);
                    streecodePageLoaderContext.addBlockFetched(StreetcodeBlock.TimelineItems);
                });
            }
        },
        [getStreetCodeId],
    );

    useEffect(() => {
        const hash = getUrlHash(location);
        if (!isScrolled && hash === 'timeline') {
            const element = document.getElementById(hash);

            setTimeout(() => {
                if (element !== null) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setIsScrolled(true);
                }
            }, 1000);
        }
    });

    return (
        <div>
            {(getTimelineItemArray.length > 0)
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
                ) : <></>}
        </div>
    );
};

export default observer(TimelineBlock);
