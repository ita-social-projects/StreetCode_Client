import './Partners.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx, { useAdditionalContext, useStreetcodeDataContext } from '@stores/root-store';

import PartnersApi from '@/app/api/partners/partners.api';
import Partner from '@/models/partners/partners.model';

import PartnerItem from './PartnerItem/PartnerItem.component';

const PartnersComponent = () => {
    // const { partnersStore } = useMobx();
    const { streetcodeStore: { getStreetCodeId, errorStreetCodeId } } = useStreetcodeDataContext();
    // const { imageLoaderStore } = useAdditionalContext();
    // const { fetchPartnersByStreetcodeId, getPartnerArray } = partnersStore;
    // const { handleImageLoad } = imageLoaderStore;
    const [partners, setPartners] = useState<Partner[]>([]);

    useAsync(
        () => {
            const streetcodeId = getStreetCodeId;
            if (streetcodeId !== errorStreetCodeId && streetcodeId > 0) {
                PartnersApi.getByStreetcodeId(getStreetCodeId).then((res) => setPartners(res));
                /*  Promise.all([
                    fetchPartnersByStreetcodeId(getStreetCodeId),
                ]); */
            }
        },
        [getStreetCodeId],
    );

/*     useEffect(() => {
        imageLoaderStore.totalImagesToLoad += partners.length;
    }, [partners.length]); */

    const useResponsiveSettings = (breakpoint: number, slidesToShow: number) => ({
        breakpoint,
        settings: {
            slidesToShow: partners.length > slidesToShow ? slidesToShow : partners.length,
        },
    });

    const responsiveSettingsDesktop = useResponsiveSettings(10000, 3);
    const responsiveSettingsTablet = useResponsiveSettings(1024, 4);
    const responsiveSettingsMobile = useResponsiveSettings(780, 2);

    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        autoplay: false,
        draggable: true,
        swipe: true,
        speed: 4000,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [responsiveSettingsTablet, responsiveSettingsMobile, responsiveSettingsDesktop],
    };

    const sliderItems = partners.map((p) => (
        <PartnerItem
            key={p.id}
            partner={p}
            handleImageLoad={()=>{}}
        />
    ));

    return (
        partners.length > 0 ? (
            <div className="partnersWrapper ">
                <div className="partnerContainer">
                    <SlickSlider
                        className="heightContainer"
                        {...settings}
                    >
                        {sliderItems}
                    </SlickSlider>
                </div>
            </div>
        ) : <></>
    );
};

export default (PartnersComponent);
