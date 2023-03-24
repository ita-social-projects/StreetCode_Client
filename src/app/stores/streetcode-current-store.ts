import { makeAutoObservable, observable, runInAction } from 'mobx';
import StreetcodesApi from '@api/streetcode/streetcodes.api';

import Streetcode from '@/models/streetcode/streetcode-types.model';

export default class StreetcodeStore {
    public currentStreetcode = observable(new Map<number, Streetcode>());

    constructor() {
        makeAutoObservable(this);
    }

    public set setStreetCode(streetcode: Streetcode) {
        this.currentStreetcode.clear();
        this.currentStreetcode.set(streetcode.id, streetcode);
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
        return Array.from(this.currentStreetcode.values()).at(0)?.id;
    }
}
