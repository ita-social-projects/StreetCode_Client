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
    const { timelineItemStore: { activeSlideIdx, setActiveYear, getYearsArray } } = useMobx();

    const [isFirstYearInView, setIsFirstYearInView] = useState(true);
    const [isLastYearInView, setIsLastYearInView] = useState(false);

    useEffect(() => {
        if (swiperRef && swiperRef.current && activeSlideIdx !== null) {
            swiperRef.current.swiper.slideTo(activeSlideIdx);
        }
    }, [activeSlideIdx]);

    const onNextSwipeProps = useMemo(() => ({
        allowSlidePrev: activeSlide !== 0,
        allowSlideNext: activeSlide !== children.length - 1,
    }), [activeSlide, children.length]);

    useEffect(() => {
        const visibleChilds = swiperRef.current?.swiper.slides
            .filter((el: Element) => el.classList.contains('swiper-slide-visible')) ?? [];
        setIsFirstYearInView(visibleChilds?.some((el: Element) => el.classList.contains('firstElement')));
        setIsLastYearInView(visibleChilds?.some((el: Element) => el.classList.contains('lastElement')));
    }, [activeSlideIdx, setIsFirstYearInView, setIsLastYearInView]);

    return (
        <Swiper
            ref={swiperRef}
            {...swiperProps}
            {...(!edgeSwipe ? onNextSwipeProps : undefined)}
            initialSlide={initialSlide}
            onSlideChange={({ activeIndex }) => {
                setActiveSlide(activeIndex);
                setActiveYear(getYearsArray[activeIndex]);
            }}
        >
            <TimelineSwiperEdgeBtn
                lastTickIdx={children.length - 1}
                side="left"
                style={{ display: isFirstYearInView ? 'none' : 'block' }}
            />
            {children.map((child, idx) => (
                <SwiperSlide
                    key={idx}
                    className={`${(idx === 0 ? 'firstElement'
                        : idx === (children.length - 1) ? 'lastElement' : ' ')}`}
                >
                    <div className={`tickContainer ${(idx === activeSlide) ? 'active' : ''}`}>
                        {child}
                    </div>
                </SwiperSlide>
            ))}
            <TimelineSwiperEdgeBtn
                lastTickIdx={children.length - 1}
                side="right"
                style={{ display: isLastYearInView ? 'none' : 'block' }}
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
