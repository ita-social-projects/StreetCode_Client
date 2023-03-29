import { makeAutoObservable } from 'mobx';
import StreetcodesApi from '@api/streetcode/streetcodes.api';

import GetAllStreetcodesRequest from '@/models/streetcode/getAllStreetcodes.request';
import { StreetcodeCatalogRecord } from '@/models/streetcode/streetcode-types.model';

export default class StreetcodesCatalogStore {
    public streetcodes = new Array<StreetcodeCatalogRecord>();

    constructor() {
        makeAutoObservable(this);
    }

    public fetchStreetcodes = async () => {
        try {
            const array = await StreetcodesApi.getAll(
                { Page: null, Amount: null, Sort: null, Title: null, Filter: null } as GetAllStreetcodesRequest,
            );
            console.log(array);
            this.streetcodes = array.streetcodes.map((streetcode) => (
                {
                    id: streetcode.id,
                    alias: streetcode.alias,
                    title: streetcode.title,
                    imgUrl: undefined,
                    url: streetcode.transliterationUrl,
                } as StreetcodeCatalogRecord));
        } catch (error) {
            console.log(error);
        }
    };

    get getCatalogStreetcodesArray() {
        return this.streetcodes;
    }
}
