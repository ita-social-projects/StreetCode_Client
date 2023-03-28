import { makeAutoObservable } from 'mobx';
import StreetcodesApi from '@api/streetcode/streetcodes.api';

import { StreetcodeCatalogItem } from '@/models/streetcode/streetcode-types.model';

export default class StreetcodesCatalogStore {
    private streetcodes = new Array<StreetcodeCatalogItem>();

    constructor() {
        makeAutoObservable(this);
    }

    public fetchStreetcodes = async () => {
        try {
            const array = await StreetcodesApi.getAll(undefined);
            this.streetcodes = array.map((streetcode) => (
                {
                    id: streetcode.id,
                    alias: streetcode.alias,
                    title: streetcode.title,
                    imgUrl: streetcode.images.at(0)?.url,
                    url: streetcode.url,
                } as StreetcodeCatalogItem));
        } catch (error) {
            console.log(error);
        }
    };

    public getCatalogStreetcodesArray() {
        return this.streetcodes;
    }
}
