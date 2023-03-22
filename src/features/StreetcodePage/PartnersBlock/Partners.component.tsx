import './Partners.styles.scss';

import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { useRouteId } from '@hooks/stateful/useRouter.hook';
import useMobx from '@stores/root-store';

import PartnerItem from './PartnerItem/PartnerItem.component';

const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    speed: 4000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 4,
            },
        },
        {
            breakpoint: 780,
            settings: {
                slidesToShow: 2,
            },
        },
    ],
};

const PartnersComponent = () => {
    const { partnersStore } = useMobx();
    const { fetchPartnersByStreetcodeId, getPartnerArray } = partnersStore;

    const streetcodeId = useRouteId();

    useAsync(
        () => Promise.all([
            fetchPartnersByStreetcodeId(streetcodeId),
        ]),
        [streetcodeId],
    );

    const sliderItems = getPartnerArray.map((p) => (
        <PartnerItem
            partner={p}
        />
    ));

    return (
        <div className="partnersWrapper">
            <div className="partnerContainer">
                <SlickSlider
                    className="heightContainer"
                    {...settings}
                >
                    {sliderItems}
                </SlickSlider>
            </div>
        </div>
    );
};

export default PartnersComponent;
