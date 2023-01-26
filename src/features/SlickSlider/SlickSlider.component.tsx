import './SlickSlider.styles.scss';

import { observer } from 'mobx-react-lite';
import {
    FC, memo, useCallback, useEffect, useRef,
} from 'react';
import Slider, { Settings as SliderProps } from 'react-slick';
import useMobx from '@stores/root-store';

type SliderWithoutChildren = Omit<SliderProps, 'children'>;

interface Props extends SliderWithoutChildren {
    onClick?: (index: number) => void;
    swipeOnClick?: boolean;
    children: JSX.Element[];
}

const BlockSlider: FC<Props> = ({
    children,
    onClick,
    swipeOnClick = false,
    ...sliderProps
}) => {
    const { timelineItemStore } = useMobx();
    const sliderRef = useRef<Slider>(null);
    const { getTimelineItemArray, activeYear, setActiveSlideIdx } = timelineItemStore;

    useEffect(() => {
        if (sliderRef && sliderRef.current) {
            const sectionIdx = getTimelineItemArray
                .findIndex(({ date }) => date.getFullYear() === activeYear);

            if (sectionIdx !== -1) {
                sliderRef.current.slickGoTo(sectionIdx);
            }
        }
    }, [activeYear]);

    const handleClick = useCallback((index: number) => {
        if (sliderRef && sliderRef.current && swipeOnClick) {
            sliderRef.current.slickGoTo(index);
        }
        if (onClick) {
            onClick(index);
        }
    }, [onClick, swipeOnClick]);

    const onBeforeChange = (curIdx: number, nextIdx: number) => {
        const year = getTimelineItemArray[nextIdx].date.getFullYear();
        setActiveSlideIdx(getTimelineItemArray.findIndex(({ date }) => date.getFullYear() === year));
    };

    return (
        <div className="sliderClass">
            <Slider
                ref={sliderRef}
                {...sliderProps}
                className={!sliderProps.infinite ? 'nonInfiniteSlider' : ''}
                beforeChange={onBeforeChange}
            >
                {children.map((slide, idx) => (
                    <div key={idx} onClick={() => handleClick(idx)}>
                        {slide}
                    </div>
                ))}
            </Slider>
        </div>
    );
};

const defaultProps: SliderWithoutChildren = {
    dots: true,
    arrows: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 500,
};
BlockSlider.defaultProps = defaultProps;

export default memo(observer(BlockSlider));
