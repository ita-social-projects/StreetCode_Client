import './Partners.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef, useState } from 'react';
import SlickSlider from '@features/SlickSlider/SlickSlider.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import useMobx, { useStreecodePageLoaderContext, useStreetcodeDataContext } from '@stores/root-store';

import ImagesApi from '@/app/api/media/images.api';
import PartnersApi from '@/app/api/partners/partners.api';
import Partner from '@/models/partners/partners.model';

import PartnerItem from './PartnerItem/PartnerItem.component';

const PartnersComponent = () => {
    const { streetcodeStore: { getStreetCodeId, errorStreetCodeId } } = useStreetcodeDataContext();
    const streecodePageLoaderContext = useStreecodePageLoaderContext();
    const [partners, setPartners] = useState<Partner[]>([]);

    useAsync(
        () => {
            const streetcodeId = getStreetCodeId;
            if (streetcodeId && streetcodeId !== errorStreetCodeId && streetcodeId > 0) {
                PartnersApi.getByStreetcodeId(getStreetCodeId)
                    .then((res) => {
                        Promise.all(res.map((p, index) => ImagesApi.getById(p.logoId)
                            .then((img) => {
                                res[index].logo = img;
                            }))).then(() => {
                            setPartners(res); streecodePageLoaderContext.addBlockFetched();
                        });
                    });
            }
        },
        [getStreetCodeId],
    );

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

    return (
        partners.length > 0 ? (
            <div className="partnersWrapper ">
                <div className="partnerContainer">
                    <SlickSlider
                        className="heightContainer"
                        {...settings}
                    >
                        {partners.map((p) => (
                            <PartnerItem
                                key={p.id}
                                partner={p}
                            />
                        ))}
                    </SlickSlider>
                </div>
            </div>
        ) : <></>
    );
};

export default observer(PartnersComponent);
