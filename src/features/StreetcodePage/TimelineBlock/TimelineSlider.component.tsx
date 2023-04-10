import { observer } from 'mobx-react-lite';
import { FC, useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import SliderProps, { defaultSliderProps } from '@features/SlickSlider';
import useMobx from '@stores/root-store';

const TimelineSlider: FC<SliderProps> = ({ children, swipeOnClick = false, ...sliderProps }) => {
    const sliderRef = useRef<Slider>(null);
    const [centerMode, setCenterMode] = useState<boolean>(false);
    const [slideToShow, setSlideToShow] = useState<number>(1);
    const swiped = useRef<boolean>(false);
    const { timelineItemStore } = useMobx();
    const { getTimelineItemArray, activeYear, setActiveYear } = timelineItemStore;

    useEffect(() => {
        if (sliderRef && sliderRef.current) {
            const sectionIdx = getTimelineItemArray
                .findIndex(({ date }) => date.getFullYear() === activeYear);
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
    }, [activeYear]);

    const handleClick = (index: number) => {
        if (sliderRef && sliderRef.current && swipeOnClick) {
            setActiveYear(getTimelineItemArray[index].date.getFullYear());
            sliderRef.current.slickGoTo(index);
        }
    };

    const onAfterChange = (curIdx: number) => {
        if (swiped.current) {
            const timelineArr = getTimelineItemArray;
            const year = timelineArr[Number(curIdx.toFixed(0)) % timelineArr.length].date.getFullYear();
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
                centerMode={centerMode}
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
