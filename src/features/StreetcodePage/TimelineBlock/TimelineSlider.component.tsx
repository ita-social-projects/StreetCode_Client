import { observer } from 'mobx-react-lite';
import { FC, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Slider from 'react-slick';
import SliderProps, { defaultSliderProps } from '@features/SlickSlider';
import useMobx from '@stores/root-store';

const TimelineSlider: FC<SliderProps> = ({ children, swipeOnClick = false, ...sliderProps }) => {
    const sliderRef = useRef<Slider>(null);
    const [centerMode, setCenterMode] = useState<boolean>(false);
    const swiped = useRef<boolean>(false);
    const { timelineItemStore } = useMobx();
    const { getTimelineItemArray, activeYear, setActiveYear } = timelineItemStore;

    const [searchParams, setSearchParams] = useSearchParams();
    const timelineItemId = Number(searchParams.get('timelineItemId'));
    const [timelineItemIndex, setTimelineItemIndex] = useState<number>(getTimelineItemArray.findIndex((timelineItem) => timelineItem.id === timelineItemId));

    useEffect(() => {
        if (sliderRef && sliderRef.current && timelineItemIndex < 0) {
            const sectionIdx = getTimelineItemArray
                .findIndex(({ date }) => new Date(date).getFullYear() === activeYear);
            if (sectionIdx === 0) {
                setCenterMode(false);
            } else if (!centerMode) {
                setCenterMode(true);
            }
            if (sectionIdx !== -1) {
                sliderRef.current.slickGoTo(sectionIdx);
            }
            swiped.current = false;
        } else {
            sliderRef?.current?.slickGoTo(timelineItemIndex);
            setActiveYear(new Date(getTimelineItemArray[timelineItemIndex].date).getFullYear());
            setTimelineItemIndex(-1);
        }
    }, [activeYear]);

    const handleClick = (index: number) => {
        if (sliderRef && sliderRef.current && swipeOnClick) {
            setActiveYear(new Date(getTimelineItemArray[index].date).getFullYear());
            sliderRef.current.slickGoTo(index);
        }
    };

    const onAfterChange = (curIdx: number) => {
        if (swiped.current) {
            const timelineArr = getTimelineItemArray;
            const year = new Date(timelineArr[Number(curIdx.toFixed(0)) % timelineArr.length].date).getFullYear();
            setActiveYear(year);
        }
    };

    const onSwipe = () => {
        swiped.current = true;
    };

    const onKeyDown = (event: React.KeyboardEvent) => {
        const key = event.key;
        if (key == "ArrowLeft" || key == "ArrowRight"){
            swiped.current = true;
        }
    }

    const customDot = (index: number) => {
        return (
            <button onPointerDown={() => handleClick(index)}>{index}</button>
        )
    }

    return (
        <div>
            <Slider
                ref={sliderRef}
                {...sliderProps}
                centerMode
                onSwipe={onSwipe}
                slidesToShow={1}
                customPaging={(index) => customDot(index)}
                afterChange={onAfterChange}
                speed={100}
            >
                {children.map((slide, idx) => (
                    <div key={idx} onKeyDown={onKeyDown} onClick={() => handleClick(idx)}>
                        {slide}
                    </div>
                ))}
            </Slider>
        </div>
    );
};

TimelineSlider.defaultProps = defaultSliderProps;

export default observer(TimelineSlider);
