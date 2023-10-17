import './StreetcodeCatalog.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import Footer from '@layout/footer/Footer.component';
import useMobx from '@stores/root-store';

import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';

import StreetcodeCatalogItem from './StreetcodeCatalogItem/StreetcodeCatalogItem.component';

const StreetcodeCatalog = () => {
    const { streetcodeCatalogStore } = useMobx();
    const { fetchCatalogStreetcodes, getCatalogStreetcodesArray, moreThenEight } = streetcodeCatalogStore;
    const [loading, setLoading] = useState(false);
    const [screen, setScreen] = useState(1);

    const handleSetNextScreen = () => {
        setScreen(screen + 1);
    };
    useEffect(() => {
        if (screen > 1) {
            setLoading(true);
        }
    }, [screen]);

    useAsync(async () => {
        const count = await StreetcodesApi.getCount();

        if (count === getCatalogStreetcodesArray.length) {
            return;
        }
        setTimeout(() => {
            Promise.all([fetchCatalogStreetcodes(screen, 8)]).then(() => {
                setLoading(false);
            });
        }, 1000);
    }, [screen]);

    return (
        <div className="catalogPage">
            <div className="streetcodeCatalogWrapper">
                <h1 className="streetcodeCatalogHeading">Стріткоди</h1>
                <div className="steetcodeCatalogContainer">
                    {
                        getCatalogStreetcodesArray.map(
                            (streetcode, index) => (
                                <StreetcodeCatalogItem
                                    key={streetcode.id}
                                    streetcode={streetcode}
                                    isLast={index === getCatalogStreetcodesArray.length - 1}
                                    handleNextScreen={handleSetNextScreen}
                                />
                            ),
                        )
                    }
                </div>
            </div>
            {
                loading && (moreThenEight)
                && (
                    <div className="loadingWrapper">
                        <div id="loadingGif" />
                    </div>
                )
            }
        </div>
    );
};

export default observer(StreetcodeCatalog);
