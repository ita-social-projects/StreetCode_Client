import './TopCarousel.styles.scss';

import StreetcodeMarker from '@images/footer/main-page.png';
import StreetcodeMarker6 from '@images/footer/main-page-mob.png';
import StreetcodeMarker7 from '@images/footer/main-page-mob2.png';
import StreetcodeMarker8 from '@images/footer/main-page-mob3.png';
import StreetcodeMarker2 from '@images/footer/main-page2.png';
import StreetcodeMarker3 from '@images/footer/main-page3.png';

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
