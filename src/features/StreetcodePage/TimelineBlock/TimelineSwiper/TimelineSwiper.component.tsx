import 'swiper/scss';
import './TimelineSwiper.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useMobx from '@stores/root-store';
import TimelineSwiperEdgeBtn
    from '@streetcode/TimelineBlock/TimelineSwiper/TimelineSwiperEdgeBtn/TimelineSwiperEdgeBtn.component';
import { Swiper, SwiperProps, SwiperRef, SwiperSlide } from 'swiper/react';

type SwiperWithoutChildren = Omit<SwiperProps, 'children'>;

interface Props extends SwiperWithoutChildren {
    children: JSX.Element[];
    edgeSwipe?: boolean;
}

const TimelineSwiper: React.FC<Props> = ({
    children,
    initialSlide,
    edgeSwipe = false,
    ...swiperProps
}) => {
    const swiperRef = useRef<SwiperRef>(null);
    const [activeSlide, setActiveSlide] = useState(0);

    const { timelineItemStore } = useMobx();
    const { activeYear, setActiveYear, getYearsArray } = timelineItemStore;

    useEffect(() => {
        if (swiperRef && swiperRef.current && activeYear !== null) {
            const activeYearIdx = getYearsArray.findIndex((y) => y === activeYear);

            if (swiperRef.current.swiper.activeIndex !== activeYearIdx) {
                swiperRef.current.swiper.slideTo(activeYearIdx);
            }
        }
    }, [activeYear]);

    const onNextSwipeProps = useMemo(() => ({
        allowSlidePrev: activeSlide !== 0,
        allowSlideNext: activeSlide !== children.length - 1,
    }), [activeSlide, children.length]);

    return (
        <Swiper
            ref={swiperRef}
            {...swiperProps}
            {...(!edgeSwipe ? onNextSwipeProps : undefined)}
            onSlideChange={({ activeIndex }) => {
                setActiveSlide(activeIndex);
                setActiveYear(getYearsArray[activeIndex]);
            }}
        >
            <TimelineSwiperEdgeBtn
                lastTickIdx={children.length - 1}
                side="left"
            />
            {children.map((child, idx) => (
                <SwiperSlide key={idx}>
                    <div className={`tickContainer ${(idx === activeSlide) ? 'active' : ''}`}>
                        {child}
                    </div>
                </SwiperSlide>
            ))}
            <TimelineSwiperEdgeBtn
                lastTickIdx={children.length - 1}
                side="right"
            />
        </Swiper>
    );
};

const defaultProps: SwiperWithoutChildren = {
    loop: false,
    slidesPerView: 3,
    direction: 'horizontal',
    speed: 900,
    centeredSlides: true,
    autoHeight: true,
    slideToClickedSlide: false,
};
TimelineSwiper.defaultProps = defaultProps;

export default observer(TimelineSwiper);
