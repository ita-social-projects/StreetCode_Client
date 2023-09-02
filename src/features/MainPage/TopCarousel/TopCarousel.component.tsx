import './TopCarousel.styles.scss';

import StreetcodeMarker from '@images/footer/main-page.webp';
import StreetcodeMarker6 from '@images/footer/main-page-mob.webp';
import StreetcodeMarker7 from '@images/footer/main-page-mob2.webp';
import StreetcodeMarker8 from '@images/footer/main-page-mob3.webp';
import StreetcodeMarker2 from '@images/footer/main-page2.webp';
import StreetcodeMarker3 from '@images/footer/main-page3.webp';
import StreetcodeMarker4 from '@images/footer/main-page4.webp';
import StreetcodeMarker5 from '@images/footer/main-page5.webp';

import { observer } from 'mobx-react-lite';
import { useMediaQuery } from 'react-responsive';

import { Carousel } from 'antd';

const content = [
    {
        image: StreetcodeMarker,
    },
    {
        image: StreetcodeMarker2,
    },
    {
        image: StreetcodeMarker3,
    },
    {
        image: StreetcodeMarker4,
    },
    {
        image: StreetcodeMarker5,
    },
];

const contentMobile = [
    {
        image: StreetcodeMarker6,
    },
    {
        image: StreetcodeMarker7,
    },
    {
        image: StreetcodeMarker8,
    },

];

const TopCarouselBlock = () => {
    const isMobile = useMediaQuery({
        query: '(max-width: 480px)',
    });

    const PLAY_SPEED = 4000;

    return (
        isMobile
            ? (
                <Carousel className="top-carousel" autoplay autoplaySpeed={PLAY_SPEED}>
                    {contentMobile.map((item) => (
                        <div key={item.image}>
                            <img
                                src={item.image}
                                className="carousel-image"
                            />
                        </div>
                    ))}
                </Carousel>
            ) : (
                <Carousel className="top-carousel" autoplay autoplaySpeed={PLAY_SPEED}>
                    {content.map((item) => (
                        <div key={item.image}>
                            <img
                                src={item.image}
                                className="carousel-image"
                            />
                        </div>
                    ))}
                </Carousel>
            )
    );
};

export default observer(TopCarouselBlock);
