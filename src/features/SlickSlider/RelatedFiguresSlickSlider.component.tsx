import './SlickSlider.styles.scss';

import { FC, memo, useCallback, useRef, useState } from 'react';
import Slider, { Settings } from 'react-slick';

import SliderProps, { defaultSliderProps } from './index';

const RFSlider: FC<SliderProps> = ({
  children,
  onClick,
  swipeOnClick,
  ...sliderProps
}) => {
  const sliderRef = useRef<Slider>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleClick = useCallback(
    (index: number) => {
      if (sliderRef && sliderRef.current && swipeOnClick) {
        if (index > currentSlideIndex) {
          sliderRef.current.slickNext();
          setCurrentSlideIndex(currentSlideIndex + 1);
        } else if (index < currentSlideIndex) {
          sliderRef.current.slickPrev();
          setCurrentSlideIndex(currentSlideIndex - 1);
        }
      }
      if (onClick) {
        onClick(index);
      }
    },
    [onClick, swipeOnClick]
  );

  const beforeChange = useCallback(
    (currentSlide: number, nextSlide: number) => {
      const slideWidth = 165;
      const gap = 10;
      const track = document.querySelector('.slick-track');
      if (track) {
        const offset = (slideWidth + gap) * nextSlide;
        track.setAttribute(
          'style',
          `transform: translate3d(-${offset}px, 0px, 0px); transition-duration: ${sliderProps.speed}ms;`
        );
      }
    },
    [sliderProps.speed]
  );

  return (
    <div className="sliderClass">
      <Slider
        ref={sliderRef}
        {...sliderProps}
        className={!sliderProps.infinite ? 'nonInfiniteSlider' : ''}
        beforeChange={beforeChange}
      >
        {children?.map((slide, idx) => (
          <div key={idx} onClick={() => handleClick(idx)}>
            {slide}
          </div>
        ))}
      </Slider>
    </div>
  );
};

RFSlider.defaultProps = defaultSliderProps;

export default memo(RFSlider);
