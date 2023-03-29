import './StreetcodeCatalog.styles.scss';

import { observer } from 'mobx-react-lite';
import Footer from '@layout/footer/Footer.component';
import useMobx from '@stores/root-store';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';

import StreetcodeCatalogItem from './StreetcodeCatalogItem/StreetcodeCatalogItem.component';

const StreetcodeCatalog = () => {
    const { streetcodeCatalogStore } = useMobx();
    const { fetchStreetcodes, getCatalogStreetcodesArray } = streetcodeCatalogStore;

    useAsync(() => fetchStreetcodes, []);

    return (
        <div>
            <div className="streetcodeCatalogWrapper">
                <h1 className="streetcodeCatalogHeading">Каталог</h1>
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
