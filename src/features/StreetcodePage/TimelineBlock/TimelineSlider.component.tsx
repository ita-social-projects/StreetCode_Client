import { observer } from 'mobx-react-lite';
import { FC, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import SliderProps, { defaultSliderProps } from '@features/SlickSlider';
import useMobx from '@stores/root-store';

const TimelineSlider: FC<SliderProps> = ({ children, swipeOnClick = false, ...sliderProps }) => {
    const sliderRef = useRef<Slider>(null);

    const { timelineItemStore } = useMobx();
    const { getTimelineItemArray, activeYear, setActiveYear } = timelineItemStore;

    useEffect(() => {
        if (sliderRef && sliderRef.current) {
            const sectionIdx = getTimelineItemArray
                .findIndex(({ date }) => date.getFullYear() === activeYear);

            if (sectionIdx !== -1) {
                sliderRef.current.slickGoTo(sectionIdx);
            }
        }
    }, [activeYear]);

    const handleClick = (index: number) => {
        if (sliderRef && sliderRef.current && swipeOnClick) {
            sliderRef.current.slickGoTo(index);
        }
    };

    const onBeforeChange = (curIdx: number, nextIdx: number) => {
        const year = getTimelineItemArray[nextIdx].date.getFullYear();
        setActiveYear(year);
        // setActiveSlideIdx(getTimelineItemArray.findIndex(({ date }) => date.getFullYear() === year));
    };

    return (
        <div className="sliderClass">
            <Slider
                ref={sliderRef}
                {...sliderProps}
                beforeChange={onBeforeChange}
            >
                {children.map((slide, idx) => (
                    <div key={idx} onClick={() => handleClick(idx)}>
                        {slide}
                    </div>
                ))}
            </Slider>
        </div>
    );
};

TimelineSlider.defaultProps = defaultSliderProps;

export default observer(TimelineSlider);
