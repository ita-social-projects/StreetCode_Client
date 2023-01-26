import 'swiper/scss';
import './TimelineSwiper.styles.scss';

import { FC, useMemo, useState } from 'react';
import TimelineSwiperEdgeBtn
    from '@streetcode/TimelineBlock/TimelineSwiper/TimelineSwiperEdgeBtn/TimelineSwiperEdgeBtn.component';
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';

type SwiperWithoutChildren = Omit<SwiperProps, 'children'>;

interface Props extends SwiperWithoutChildren {
    children: JSX.Element[];
    edgeSwipe?: boolean;
}

const TimelineSwiper: FC<Props> = ({ children, initialSlide, edgeSwipe = false, ...swiperProps }) => {
    const [activeYear, setActiveYear] = useState(initialSlide);

    const onNextSwipeProps = useMemo(() => ({
        allowSlidePrev: activeYear !== 0,
        allowSlideNext: activeYear !== children.length - 1,
    }), [activeYear, children.length]);

    return (
        <Swiper
            {...swiperProps}
            {...(!edgeSwipe ? onNextSwipeProps : undefined)}
            initialSlide={initialSlide}
            onSlideChange={({ activeIndex }) => setActiveYear(activeIndex)}
        >
            <TimelineSwiperEdgeBtn
                lastSlideIdx={(children.length * 3) - 1}
                side="left"
            />
            {children.map((child, idx) => (
                <SwiperSlide key={idx}>
                    <div
                        className={`tickContainer ${(idx === activeYear) ? 'active' : ''}`}
                    >
                        {child}
                    </div>
                </SwiperSlide>
            ))}
            <TimelineSwiperEdgeBtn
                lastSlideIdx={(children.length * 3) - 1}
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

export default TimelineSwiper;
