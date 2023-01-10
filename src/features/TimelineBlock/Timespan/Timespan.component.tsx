import './Timespan.styles.scss';
import SlickSlider from "@features/SlickSlider/SlickSlider.component";

interface Props {
    yearTicks: Array<number | string>;
}

const TimelineTimespan = ({ yearTicks }: Props) => {
    const middleIdx = yearTicks[Math.round((yearTicks.length - 1) / 2)];
    
    const sliderItems = yearTicks.map((year, idx) => (
        <div style={{ height: '100%' }}>
            <div key={idx} className={'timelineYearTick'} >
                <span className={'timelineYearTickDate'} style={((middleIdx === idx) ? {} : undefined)}>
                    {year}
                </span>
            </div>
        </div>
    ))

    return (
        <div className={'timeSpanContainer'}>
            {/* TODO change container height greater then height of slideItem with text block
            because date on slide not visible */}
            <div className={'timelineYearTicksContainer'} >
                <SlickSlider
                    className={"center"}
                    swipeOnClick={true}
                    slidesToShow={7}
                    slides={sliderItems}
                    centerMode={true}
                    swipe={false}
                    dots={false}
                    arrows={false}
                />
            </div>  
        </div>
    );
};

export default TimelineTimespan;