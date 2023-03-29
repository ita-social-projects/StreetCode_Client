import { makeAutoObservable } from 'mobx';
import StreetcodesApi from '@api/streetcode/streetcodes.api';

import Streetcode, { StreetcodeCatalogItem } from '@/models/streetcode/streetcode-types.model';

export default class StreetcodesCatalogStore {
    public streetcodes = new Array<StreetcodeCatalogItem>();

    constructor() {
        makeAutoObservable(this);
    }

    public fetchStreetcodes = async () => {
        try {
            const array = await StreetcodesApi.getAll(undefined);
            console.log(array);
            this.streetcodes = array.map((streetcode) => (
                {
                    id: streetcode,
                    alias: streetcode.alias,
                    title: streetcode.title,
                    imgUrl: undefined,
                    url: streetcode.url,
                } as StreetcodeCatalogItem));
        } catch (error) {
            console.log(error);
        }
    };

    get getCatalogStreetcodesArray() {
        return this.streetcodes;
    }
}
