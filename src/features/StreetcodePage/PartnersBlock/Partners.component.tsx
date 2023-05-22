import './Partners.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx from '@stores/root-store';

import PartnerItem from './PartnerItem/PartnerItem.component';

const PartnersComponent = () => {
    const {imageLoaderStore, partnersStore, streetcodeStore: { getStreetCodeId, errorStreetCodeId } } = useMobx();
    const { fetchPartnersByStreetcodeId, getPartnerArray } = partnersStore;
    const { handleImageLoad } = imageLoaderStore;

    useAsync(
        () => {
            if (getStreetCodeId !== errorStreetCodeId) {
                Promise.all([
                    fetchPartnersByStreetcodeId(getStreetCodeId),
                ]);
            }
        },
        [getStreetCodeId],
    );

    useEffect(() => {
        imageLoaderStore.totalImagesToLoad += getPartnerArray.length;
    }, [getPartnerArray.length]);

    const useResponsiveSettings = (breakpoint: number, slidesToShow: number) => useMemo(() => ({
        breakpoint,
        settings: {
            slidesToShow: getPartnerArray.length > slidesToShow ? slidesToShow : getPartnerArray.length,
        },
    }), [getPartnerArray, breakpoint, slidesToShow]);

    const responsiveSettingsDesktop = useResponsiveSettings(10000, 3);
    const responsiveSettingsTablet = useResponsiveSettings(1024, 4);
    const responsiveSettingsMobile = useResponsiveSettings(780, 2);

    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        autoplay: true,
        draggable: true,
        swipe: true,
        speed: 4000,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [responsiveSettingsTablet, responsiveSettingsMobile, responsiveSettingsDesktop],
    };

    const sliderItems = getPartnerArray.map((p) => (
        <PartnerItem
            key={p.id}
            partner={p}
            handleImageLoad={handleImageLoad}
        />
    ));

    return (
        getPartnerArray.length > 0 ? (
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

export default observer(PartnersComponent);
