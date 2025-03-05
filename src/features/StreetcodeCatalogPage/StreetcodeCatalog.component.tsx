import './StreetcodeCatalog.styles.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import useMobx from '@stores/root-store';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';

import StreetcodeCatalogItem from './StreetcodeCatalogItem/StreetcodeCatalogItem.component';

const StreetcodeCatalog = () => {
    const { streetcodeCatalogStore } = useMobx();
    const {
        fetchCatalogStreetcodes,
        getCatalogStreetcodesArray,
        moreThenEight,
        fetchNumber,
        incrementScreen,
    } = streetcodeCatalogStore;
    const [loading, setLoading] = useState(false);

    const handleSetNextScreen = async () => {
        incrementScreen();
        setLoading(true);
        await fetchCatalogStreetcodes(fetchNumber);
        setLoading(false);
    };

    useAsync(async () => {
        if (getCatalogStreetcodesArray.length === 0) {
            setLoading(true);
            fetchCatalogStreetcodes(fetchNumber).then(() => {
                setLoading(false);
            });
        }
    }, [fetchCatalogStreetcodes, fetchNumber, getCatalogStreetcodesArray.length]);

    return (
        <div className="catalogPage">
            <Helmet>
                <title>Каталог history-кодів | Historycode</title>
                <meta name="description" content="Ознайомтеся з нашим повним каталогом history-кодів." />
            </Helmet>
            <div className="streetcodeCatalogWrapper">
                <div className="streetcodeHeadingContainer">
                    <div className="headingFlexItem"><h1 className="streetcodeCatalogHeading">History-коди</h1></div>
                    <div className="headingFlexItem"><p className="streetcodeCatalogCaption">HISTORY-КОДИ</p></div>
                </div>
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
                {
                    loading && (moreThenEight)
                    && (
                        <div className="loadingWrapper">
                            <div id="loadingGif" />
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default observer(StreetcodeCatalog);
