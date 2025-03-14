import { makeAutoObservable } from 'mobx';

import { StreetcodeFavourite } from '@/models/streetcode/streetcode-types.model';

import StreetcodesApi from '../api/streetcode/streetcodes.api';

export default class FavouritesCatalogStore {
    public favourites = new Array<StreetcodeFavourite>();

    constructor() {
        makeAutoObservable(this);
    }

    public fetchAllFavourites = async () => {
        try {
            this.favourites = await StreetcodesApi.getAllFavourites();
        } catch (error) {}
    };

    get getFavouritesArray() {
        return this.favourites;
    }
}
