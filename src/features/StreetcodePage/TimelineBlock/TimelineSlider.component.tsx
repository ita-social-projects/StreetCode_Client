import { observer } from 'mobx-react-lite';
import { FC, useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import SliderProps, { defaultSliderProps } from '@features/SlickSlider';
import useMobx from '@stores/root-store';
import { useSearchParams } from 'react-router-dom';

const TimelineSlider: FC<SliderProps> = ({ children, swipeOnClick = false, ...sliderProps }) => {
    const sliderRef = useRef<Slider>(null);
    const [centerMode, setCenterMode] = useState<boolean>(false);
    const [slideToShow, setSlideToShow] = useState<number>(1);
    const swiped = useRef<boolean>(false);
    const { timelineItemStore } = useMobx();
    const { getTimelineItemArray, activeYear, setActiveYear } = timelineItemStore;

    const [searchParams, setSearchParams] = useSearchParams();
    const timelineItemId = Number(searchParams.get('timelineItemId'));
    const [timelineItemIndex, setTimelineItemIndex] = useState<number>(getTimelineItemArray.findIndex(timelineItem => timelineItem.id === timelineItemId));

    useEffect(() => {
        if (sliderRef && sliderRef.current && timelineItemIndex < 0) {
            const sectionIdx = getTimelineItemArray
                .findIndex(({ date }) => new Date(date).getFullYear() === activeYear);
            if (sectionIdx === 0) {
                setCenterMode(false);
                setSlideToShow(2);
            } else if (!centerMode) {
                setCenterMode(true);
                setSlideToShow(1);
            }
            if (sectionIdx !== -1) {
                sliderRef.current.slickGoTo(sectionIdx);
            }
            swiped.current = false;
        }
        else {
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

    return (
        <div>
            <Slider
                ref={sliderRef}
                {...sliderProps}
                centerMode={true}
                afterChange={onAfterChange}
                onSwipe={onSwipe}
                slidesToShow={slideToShow}
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
