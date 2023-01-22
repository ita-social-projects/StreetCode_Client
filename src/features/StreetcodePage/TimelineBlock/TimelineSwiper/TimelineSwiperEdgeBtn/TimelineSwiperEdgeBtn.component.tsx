import './TimelineSwiperEdgeBtn.styles.scss';

import { useSwiper } from 'swiper/react';

interface Props {
    side: 'left' | 'right';
    lastSlideIdx: number;
    swipeSpeed?: number;
    sideMargin?: number;
}

const TimelineSwiperEdgeBtn = ({ swipeSpeed = 1500, sideMargin = 60, lastSlideIdx, side }: Props) => {
    const swiper = useSwiper();
    const isLeftEdge = side === 'left';

    return (
        <div
            className="swiperEdgeBtn"
            style={isLeftEdge ? { left: -sideMargin } : { right: -sideMargin }}
            onClick={() => swiper.slideTo((isLeftEdge ? 0 : lastSlideIdx), swipeSpeed)}
        >
            <span>
                {isLeftEdge ? 'First' : 'Last'}
            </span>
        </div>
    );
};

export default TimelineSwiperEdgeBtn;
