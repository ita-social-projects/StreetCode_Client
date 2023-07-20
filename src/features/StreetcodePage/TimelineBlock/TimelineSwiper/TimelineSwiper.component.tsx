import 'swiper/scss';
import './TimelineSwiper.styles.scss';

import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useMobx from '@stores/root-store';
import TimelineSwiperEdgeBtn
    from '@streetcode/TimelineBlock/TimelineSwiper/TimelineSwiperEdgeBtn/TimelineSwiperEdgeBtn.component';
import SwiperCore, { Pagination } from 'swiper/core';
import { Swiper, SwiperProps, SwiperRef, SwiperSlide } from 'swiper/react';

type SwiperWithoutChildren = Omit<SwiperProps, 'children'>;

SwiperCore.use([Pagination]);

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
    const yearsArray: number[] = getYearsArray;

    useEffect(() => {
        if (swiperRef && swiperRef.current && activeYear !== null) {
            const activeYearIdx = yearsArray.findIndex((y) => y === activeYear);

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
            className="swiperClass"
            pagination={{ clickable: true }}
            centeredSlides
            ref={swiperRef}
            {...swiperProps}
            {...(!edgeSwipe ? onNextSwipeProps : undefined)}
            onSlideChange={({ activeIndex }) => {
                setActiveSlide(activeIndex);
                setActiveYear(yearsArray[activeIndex]);
            }}
        >
            {
                yearsArray.indexOf(activeYear!) > 2 ? (
                    <TimelineSwiperEdgeBtn
                        lastTickIdx={children.length - 1}
                        side="left"
                        year={yearsArray[0]}
                    />
                ) : ''
            }

            {children.map((child, idx) => (
                <SwiperSlide key={idx}>
                    <div className={`tickContainer ${(idx === activeSlide) ? 'active' : ''}`}>
                        {child}
                    </div>
                </SwiperSlide>
            ))}
            {
                yearsArray.indexOf(activeYear!) < yearsArray.length - 3 ? (
                    <TimelineSwiperEdgeBtn
                        lastTickIdx={children.length - 1}
                        side="right"
                        year={yearsArray[yearsArray.length - 1]}
                    />
                ) : ''
            }

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
