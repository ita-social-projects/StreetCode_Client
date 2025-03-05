import { makeAutoObservable, runInAction } from 'mobx';
import StreetcodesApi from '@api/streetcode/streetcodes.api';

import { StreetcodeCatalogRecord } from '@/models/streetcode/streetcode-types.model';

export default class StreetcodesCatalogStore {
    public catalog = new Array<StreetcodeCatalogRecord>();

    public fetchNumber = 8;

    public moreThenEight = false;

    public screen = 1;

    constructor() {
        makeAutoObservable(this);
    }

    public incrementScreen = () => {
        this.screen += 1;
    };

    public fetchCatalogStreetcodes = async (count = this.fetchNumber) => {
        try {
            const fetchedPublishCount = (await StreetcodesApi.getCount(true));
            const array = await StreetcodesApi.getAllCatalog(this.screen, count);

            const uniqueNewItems = array.filter(
                (item) => !this.catalog.some((existingItem) => existingItem.id === item.id),
            );

            runInAction(() => {
                this.catalog = this.catalog.concat(uniqueNewItems);
                this.moreThenEight = this.catalog.length < fetchedPublishCount
                    && fetchedPublishCount > this.fetchNumber;
            });
        } catch (error) {
            console.error('Failed to fetch catalog streetcodes:', error);
            runInAction(() => {
                this.moreThenEight = false;
            });
        }
    };

    get getCatalogStreetcodesArray() {
        return this.catalog;
    }
}
