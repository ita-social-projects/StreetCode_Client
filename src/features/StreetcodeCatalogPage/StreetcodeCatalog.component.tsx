import './StreetcodeCatalog.styles.scss';

import { observer } from 'mobx-react-lite';
import { useRef, useState } from 'react';
import Footer from '@layout/footer/Footer.component';
import useMobx from '@stores/root-store';

import useOnScreen from '@/app/common/hooks/scrolling/useOnScreen.hook';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { StreetcodeCatalogRecord } from '@/models/streetcode/streetcode-types.model';

import StreetcodeCatalogItem from './StreetcodeCatalogItem/StreetcodeCatalogItem.component';

const page = 1;

const StreetcodeCatalog = () => {
    const { streetcodeCatalogStore } = useMobx();
    const { fetchCatalogStreetcodes, getCatalogStreetcodesArray } = streetcodeCatalogStore;

    useAsync(() => fetchCatalogStreetcodes(page), [page]);

    return (
        <div>
            <div className="streetcodeCatalogWrapper">
                <h1 className="streetcodeCatalogHeading">Стріткоди</h1>
                <div className="steetcodeCatalogContainer">
                    {
                        getCatalogStreetcodesArray.map(
                            (streetcode) => <StreetcodeCatalogItem streetcode={streetcode} />,
                        )
                    }
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default observer(StreetcodeCatalog);
