import './Partners.styles.scss';

import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import { useRouteId } from '@hooks/stateful/useRouter.hook';
import useMobx from '@stores/root-store';

import PartnerItem from './PartnerItem/PartnerItem.component';

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
                    slidesToShow={3}
                    slides={sliderItems}
                    autoplay
                    autoplaySpeed={3000}
                    arrows={false}
                    swipe={false}
                    dots={false}
                    swipeOnClick={false}
                />
            </div>
        </div>
    );
};

export default PartnersComponent;
