import './TimelineSwiperEdgeBtn.styles.scss';

import { observer } from 'mobx-react-lite';
import useMobx from '@stores/root-store';
import { useSwiper } from 'swiper/react';

interface Props {
    side: 'left' | 'right';
    lastTickIdx: number;
    swipeSpeed?: number;
    sideMargin?: number;
}

const TimelineSwiperEdgeBtn = ({ swipeSpeed = 900, sideMargin = 60, lastTickIdx, side }: Props) => {
    const { timelineItemStore: { setActiveYear, getTimelineItemArray } } = useMobx();
    const swiper = useSwiper();

    const isLeftEdge = side === 'left';

    const handleClick = () => {
        const slideToCardIdx = isLeftEdge ? 0 : getTimelineItemArray.length - 1;

        swiper.slideTo((isLeftEdge ? 0 : lastTickIdx), swipeSpeed);
        setActiveYear(getTimelineItemArray[slideToCardIdx].date.getFullYear());
    };

    return (
        <div
            className="swiperEdgeBtn"
            onClick={handleClick}
            style={isLeftEdge ? { left: -sideMargin } : { right: -sideMargin }}
        >
            <span>
                {isLeftEdge ? 'First' : 'Last'}
            </span>
        </div>
    );
};

export default observer(TimelineSwiperEdgeBtn);
