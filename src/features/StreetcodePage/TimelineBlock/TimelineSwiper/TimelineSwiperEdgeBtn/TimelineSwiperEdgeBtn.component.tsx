import './TimelineSwiperEdgeBtn.styles.scss';

import { observer } from 'mobx-react-lite';
import { CSSProperties } from 'react';
import useMobx from '@stores/root-store';
import { useSwiper } from 'swiper/react';

interface Props {
    style?: CSSProperties;
    side: 'left' | 'right';
    lastTickIdx: number;
    swipeSpeed?: number;
    sideMargin?: number;
}

const TimelineSwiperEdgeBtn = ({
    style,
    swipeSpeed = 900,
    sideMargin = 60,
    lastTickIdx,
    side,
}: Props) => {
    const { timelineItemStore: { setActiveYear, getTimelineItemArray } } = useMobx();
    const swiper = useSwiper();

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
            onClick={handleClick}
            style={{ ...positionStyles, ...style }}
        >
            <span>
                {isLeftEdge ? 'First' : 'Last'}
            </span>
        </div>
    );
};

export default observer(TimelineSwiperEdgeBtn);
