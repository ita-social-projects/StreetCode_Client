import './StreetcodeCatalog.styles.scss';

import { useState } from 'react';
import Footer from '@layout/footer/Footer.component';
import useMobx from '@/app/stores/root-store';

interface MapType {
    id: number,
    url: string,
    title: string,
    alter: string,
    imgUrl: string,
}

const StreetcodeCatalog = () => {
    const [active, setActive] = useState();
    const {} = useMobx();
    return (
        <div>
            <div className="streetcodeCatalogWrapper">
                <h1 className="streetcodeCatalogHeading">Каталог</h1>
                <div className="steetcodeCatalogContainer">
                    <div className="testingDiv" />
                    <div className="testingDiv" />
                    <div className="testingDiv" />
                    <div className="testingDiv" />
                    <div className="testingDiv" />
                    <div className="testingDiv" />
                    <div className="testingDiv" />
                    <div className="testingDiv" />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default StreetcodeCatalog;
