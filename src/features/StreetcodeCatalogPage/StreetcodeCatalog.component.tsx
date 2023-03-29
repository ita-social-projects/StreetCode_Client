import './StreetcodeCatalog.styles.scss';

import { observer } from 'mobx-react-lite';
import Footer from '@layout/footer/Footer.component';
import useMobx from '@stores/root-store';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';

// const testArray = [1, 2, 3, 4, 5, 6, 7, 8];

const StreetcodeCatalog = () => {
    const { streetcodeCatalogStore, imagesStore } = useMobx();
    const { fetchStreetcodes, getCatalogStreetcodesArray } = streetcodeCatalogStore;

    useAsync(() => fetchStreetcodes, []);

    return (
        <div>
            <div className="streetcodeCatalogWrapper">
                <h1 className="streetcodeCatalogHeading">Каталог</h1>
                <div className="steetcodeCatalogContainer">
                    {
                        getCatalogStreetcodesArray.map(
                            (streetcode) => <div className="testingDiv">{streetcode.id}</div>)
                    }
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default observer(StreetcodeCatalog);
