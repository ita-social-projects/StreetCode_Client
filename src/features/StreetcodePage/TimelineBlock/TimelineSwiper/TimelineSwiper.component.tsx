import 'swiper/scss';
import './TimelineSwiper.styles.scss';

import { observer } from 'mobx-react-lite';
import {
    FC, useEffect, useMemo, useRef, useState,
} from 'react';
import useMobx from '@stores/root-store';
import TimelineSwiperEdgeBtn
    from '@streetcode/TimelineBlock/TimelineSwiper/TimelineSwiperEdgeBtn/TimelineSwiperEdgeBtn.component';
import { Swiper, SwiperProps, SwiperRef, SwiperSlide } from 'swiper/react';

type SwiperWithoutChildren = Omit<SwiperProps, 'children'>;

interface Props extends SwiperWithoutChildren {
    children: JSX.Element[];
    edgeSwipe?: boolean;
}

const TimelineSwiper: FC<Props> = ({ children, initialSlide, edgeSwipe = false, ...swiperProps }) => {
    const { timelineItemStore: { activeSlideIdx } } = useMobx();
    const [activeYear, setActiveYear] = useState(initialSlide);
    const swiperRef = useRef<SwiperRef>(null);

    useEffect(() => {
        if (swiperRef && swiperRef.current && activeSlideIdx !== null) {
            swiperRef.current.swiper.slideTo(activeSlideIdx);
        }
    }, [activeSlideIdx]);

    const onNextSwipeProps = useMemo(() => ({
        allowSlidePrev: activeYear !== 0,
        allowSlideNext: activeYear !== children.length - 1,
    }), [activeYear, children.length]);

    return (
        <Swiper
            ref={swiperRef}
            {...swiperProps}
            {...(!edgeSwipe ? onNextSwipeProps : undefined)}
            initialSlide={initialSlide}
            onSlideChange={({ activeIndex }) => setActiveYear(activeIndex)}
        >
            <TimelineSwiperEdgeBtn
                lastSlideIdx={children.length - 1}
                side="left"
            />
            {children.map((child, idx) => (
                <SwiperSlide key={idx}>
                    <div className={`tickContainer ${(idx === activeYear) ? 'active' : ''}`}>
                        {child}
                    </div>
                </SwiperSlide>
            ))}
            <TimelineSwiperEdgeBtn
                lastSlideIdx={children.length - 1}
                side="right"
            />
        </Swiper>
    );
};

const defaultProps: SwiperWithoutChildren = {
    loop: false,
    slidesPerView: 3,
    direction: 'horizontal',
    speed: 1500,
    centeredSlides: true,
    autoHeight: true,
    slideToClickedSlide: false,
};
TimelineSwiper.defaultProps = defaultProps;

export default observer(TimelineSwiper);
