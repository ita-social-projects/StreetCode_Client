import './TimelineSwiperEdgeBtn.styles.scss';

import { observer } from 'mobx-react-lite';
import useMobx from '@stores/root-store';
import { useSwiper } from 'swiper/react';

interface Props {
    side: 'left' | 'right';
    lastSlideIdx: number;
    swipeSpeed?: number;
    sideMargin?: number;
}

const TimelineSwiperEdgeBtn = ({ swipeSpeed = 1500, sideMargin = 60, lastSlideIdx, side }: Props) => {
    const swiper = useSwiper();
    const { timelineItemStore: { setActiveYear, getTimelineItemArray } } = useMobx();

    const isLeftEdge = side === 'left';

    return (
        <div
            className="swiperEdgeBtn"
            style={isLeftEdge ? { left: -sideMargin } : { right: -sideMargin }}
            onClick={() => {
                swiper.slideTo((isLeftEdge ? 0 : lastSlideIdx), swipeSpeed);
                const year = new Date(getTimelineItemArray[isLeftEdge ? 0 : getTimelineItemArray.length - 1].date)
                    .getFullYear();
                setActiveYear(year);
            }}
        >
            <span>
                {isLeftEdge ? 'First' : 'Last'}
            </span>
        </div>
    );
};

export default observer(TimelineSwiperEdgeBtn);
