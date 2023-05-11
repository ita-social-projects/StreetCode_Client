import './StreetcodeSlider.styles.scss';
import StreetcodeSliderItem from './StreetcodeSliderItem/StreetcodeSliderItem.component';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import Footer from '@layout/footer/Footer.component';
import useMobx from '@stores/root-store';

import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';


const StreetcodeSlider = () => {
    const { streetcodeCatalogStore } = useMobx();
    const { fetchCatalogStreetcodes, getCatalogStreetcodesArray } = streetcodeCatalogStore;
    const [loading, setLoading] = useState(false);
    const [screen, setScreen] = useState(1);


    useAsync(async () => {
        const count = await StreetcodesApi.getCount();
        if (count === getCatalogStreetcodesArray.length) {
            return;
        }
        setLoading(true);
        setTimeout(() => {
            Promise.all([fetchCatalogStreetcodes(screen, 8)]).then(() => {
                setLoading(false);
            });
        }, 1000);
    }, [screen]);

    return (
        <div>
            <div className="streetcodeCatalogWrapper">
                <div className="steetcodeCatalogContainer">
                    {
                        getCatalogStreetcodesArray.map(
                            (streetcode, index) => (
                                <StreetcodeSliderItem
                                    streetcode={streetcode}
                        
                                
                                />
                            ),
                        )
                    }
                </div>
            </div>
         
           
        </div>
    );
};

export default observer(StreetcodeSlider);