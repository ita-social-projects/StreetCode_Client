import { makeAutoObservable } from 'mobx';
import StreetcodesApi from '@api/streetcode/streetcodes.api';

import { StreetcodeCatalogRecord } from '@/models/streetcode/streetcode-types.model';

export default class StreetcodesCatalogStore {
    public catalog = new Array<StreetcodeCatalogRecord>();

    constructor() {
        makeAutoObservable(this);
    }

    public fetchCatalogStreetcodes = async (page: number, count = 8) => {
        try {
            const array = await StreetcodesApi.getAllCatalog(page, count);
            if (this.catalog.length === 0
                || !array.some((item) => item.id === this.catalog.at(0)?.id)) {
                this.catalog = this.catalog.concat(array);
            }
        } catch (error) {}
    };

    get getCatalogStreetcodesArray() {
        return this.catalog;
    }
}
