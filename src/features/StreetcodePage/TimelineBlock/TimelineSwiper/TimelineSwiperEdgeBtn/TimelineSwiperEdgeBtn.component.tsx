import './TimelineSwiperEdgeBtn.styles.scss';

import { observer } from 'mobx-react-lite';
import useMobx from '@stores/root-store';
import { useSwiper } from 'swiper/react';

interface Props {
    side: 'left' | 'right';
    lastTickIdx: number;
    swipeSpeed?: number;
    sideMargin?: number;
    year: number;
}

const TimelineSwiperEdgeBtn = ({
    swipeSpeed = 900,
    sideMargin = 60,
    lastTickIdx,
    side, year,
}: Props) => {
    const swiper = useSwiper();

    const { timelineItemStore } = useMobx();
    const { setActiveYear, getTimelineItemArray } = timelineItemStore;

    const isLeftEdge = side === 'left';

    const handleClick = () => {
        const slideToCardIdx = isLeftEdge ? 0 : getTimelineItemArray.length - 1;

        swiper.slideTo((isLeftEdge ? 0 : lastTickIdx), swipeSpeed);
        setActiveYear(getTimelineItemArray[slideToCardIdx].date.getFullYear());
    };

    const positionStyles = isLeftEdge ? { left: -sideMargin } : { right: -sideMargin };

    return (
        <div
            className="swiperEdgeBtn"
            style={positionStyles}
            onClick={handleClick}
        >
            <span>
                {year}
            </span>
        </div>
    );
};

export default observer(TimelineSwiperEdgeBtn);
