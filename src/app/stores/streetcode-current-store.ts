import { makeAutoObservable } from 'mobx';
import StreetcodesApi from '@api/streetcode/streetcodes.api';

import Streetcode from '@/models/streetcode/streetcode-types.model';

import AuthService from '../common/services/auth-service/AuthService';

export default class StreetcodeStore {
    public errorStreetCodeId = -1;

    public currentStreetcode = this.errorStreetCodeId;

    public prevStreetcode = this.currentStreetcode;

    public itChangedId = false;

    public streetcodeUrl = '';

    public isFavourite: boolean | undefined = undefined;

    constructor() {
        makeAutoObservable(this);
    }

    public addToFavourites = async () => {
        this.setFavourite = true;
        await StreetcodesApi.createFavourite(this.getStreetCodeId);
    };

    public deleteFromFavourites = async () => {
        this.setFavourite = false;
        await StreetcodesApi.deleteFromFavourite(this.getStreetCodeId);
    };

    public itChangedIdChange = () => {
        this.itChangedId = false;
    };

    public trackChange = () => {
        if (this.prevStreetcode !== this.currentStreetcode) {
            this.prevStreetcode = this.currentStreetcode;
            this.itChangedId = true;
            return this.itChangedId;
        }
        return false;
    };

    public set setStreetCode(streetcode: Streetcode) {
        this.currentStreetcode = streetcode.id;
    }

    public set setFavourite(val: boolean) {
        this.isFavourite = val;
    }

    public clearStore() {
        this.currentStreetcode = this.errorStreetCodeId;
    }

    public setCurrentStreetcodeId = async (url: string): Promise<Streetcode | undefined> => {
        try {
            if (await StreetcodesApi.existWithUrl(url)) {
                const streetcode = await StreetcodesApi.getByUrl(url);
                if (streetcode !== null) {
                    this.setStreetCode = streetcode;
                    if (AuthService.isLoggedIn() && !AuthService.isAdmin()) {
                        try {
                            this.isFavourite = await StreetcodesApi.getFavouriteStatus(this.currentStreetcode);
                        } catch (error) {}
                    } else {
                        this.isFavourite = undefined;
                    }
                    return streetcode;
                }
            }
        } catch (error) { }
    };

    public get getStreetCodeId() {
        return this.currentStreetcode;
    }
}
