import { observer } from 'mobx-react-lite';
import { FC, useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import SliderProps, { defaultSliderProps } from '@features/SlickSlider';
import useMobx from '@stores/root-store';

const TimelineSlider: FC<SliderProps> = ({ children, swipeOnClick = false, ...sliderProps }) => {
    const sliderRef = useRef<Slider>(null);

    const { timelineItemStore } = useMobx();
    const {
        getTimelineItemArray, activeYear, setActiveYear,
        setChangedByYear, changedByYear,
    } = timelineItemStore;

    useEffect(() => {
        if (sliderRef && sliderRef.current) {
            const sectionIdx = getTimelineItemArray
                .findIndex(({ date }) => date.getFullYear() === activeYear);
            console.log(sectionIdx);
            if (sectionIdx !== -1) {
                sliderRef.current.slickGoTo(sectionIdx);
            }
        }
    }, [activeYear]);

    const handleClick = (index: number) => {
        if (sliderRef && sliderRef.current && swipeOnClick) {
            console.log(index);
            setActiveYear(getTimelineItemArray[index].date.getFullYear());
            sliderRef.current.slickGoTo(index);
        }
        if (sliderRef && sliderRef.current) { sliderRef.current.slickGoTo(index); }
    };

    const onAfterChange = (curIdx: number) => {
        const timelineArr = getTimelineItemArray;
        const year = timelineArr[Number(curIdx.toFixed(0)) % timelineArr.length].date.getFullYear();
        if (changedByYear) {
            setChangedByYear(false);
        } else {
            setActiveYear(year);
        }
    };

    return (
        <div className="sliderClass">
            <Slider
                ref={sliderRef}
                {...sliderProps}
                afterChange={onAfterChange}
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
