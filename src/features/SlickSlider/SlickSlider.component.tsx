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
    enableExternalClick?: boolean;
}

const BlockSlider: FC<Props> = ({
    children,
    onClick,
    swipeOnClick = false,
    ...sliderProps
}) => {
    const { timelineItemStore: { activeYear, getTimelineItemArray, setActiveSlideIdx, getYearsArray } } = useMobx();
    const sliderRef = useRef<Slider>(null);

    const handleClick = useCallback((index: number) => {
        if (sliderRef && sliderRef.current) {
            sliderRef.current.slickGoTo(index);
        }
        if (onClick) {
            onClick(index);
        }
    }, [onClick]);

    useEffect(() => {
        if (sliderRef && sliderRef.current) {
            const sectionIdx = getTimelineItemArray
                .findIndex((ti) => new Date(ti.date).getFullYear() === activeYear);
            // console.log(activeYear, sectionIdx);

            if (sectionIdx !== -1) {
                sliderRef.current.slickGoTo(sectionIdx);
            }
        }
    }, [activeYear, getTimelineItemArray]);

    useEffect(() => {
        if (children.length === 1) {
            const clonedElements = document
                .querySelectorAll('.interestingFactsSliderContainer .slick-cloned');
            clonedElements.forEach((element) => element.remove());
        }
    }, [children]);

    return (
        <div className="sliderClass">
            <Slider
                {...sliderProps}
                ref={sliderRef}
                className={!sliderProps.infinite ? 'nonInfiniteSlider' : ''}
                beforeChange={(_, idx) => {
                    const year = new Date(getTimelineItemArray[idx].date).getFullYear();
                    setActiveSlideIdx(getYearsArray.findIndex((y) => y === year));
                }}
            >
                {children.map((slide, idx) => (
                    <div
                        key={idx}
                        onClick={() => {
                            if (swipeOnClick) {
                                handleClick(idx);
                            }
                        }}
                    >
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
