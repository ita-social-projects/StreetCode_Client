import './TimelineBlock.styles.scss';

import BlockHeading from '@features/StreetcodePage/HeadingBlock/BlockHeading.component';
import SlickSlider from "@features/SlickSlider/SlickSlider.component";
import TimelineTimespan from '@features/TimelineBlock/Timespan/Timespan.component';
import TimelineItem from '@features/TimelineBlock/TimelineItem/TimelineItem.component';
import TimelineReelOutline from '@features/TimelineBlock/TimelineReelOutline/TimelineReelOutline.component';

const TimelineBlock = () => {

    const sliderItems = Array(5).fill(0).map((_, idx) => (
        <TimelineItem key={idx} />
    ))

    return (
        <>
            <BlockHeading headingText={'Хронологія'} />
            <TimelineTimespan yearTicks={Array(17).fill(1894)} />
            <div className={'timelineContainer'}>
                <TimelineReelOutline />
                <div className={'timelineItemContainer'}>
                    <SlickSlider
                        className={"center"}
                        swipeOnClick={true}
                        slidesToShow={3}
                        slides={sliderItems}
                        centerMode={true}
                        swipe={false}
                        dots={false}
                        arrows={false}
                        infinite={true}
                    />
                </div>
                <TimelineReelOutline />
            </div>
        </>
    );
}

export default TimelineBlock;