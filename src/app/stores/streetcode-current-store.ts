import { makeAutoObservable, observable, runInAction } from 'mobx';
import StreetcodesApi from '@api/streetcode/streetcodes.api';

import Streetcode from '@/models/streetcode/streetcode-types.model';

export default class StreetcodeStore {
    public currentStreetcode = 0;

    constructor() {
        makeAutoObservable(this);
    }

    public set setStreetCode(streetcode: Streetcode) {
        this.currentStreetcode = streetcode.id;
    }

    public setCurrentStreetcodeId = async (url: string) => {
        try {
            const streetcode = await StreetcodesApi.getByUrl(url);
            if (streetcode !== null) {
                this.setStreetCode = streetcode;
                return streetcode;
            }
        } catch (error) {
            console.log(error);
        }
    };

    public get getStreetCodeId() {
        return this.currentStreetcode;
    }
}
