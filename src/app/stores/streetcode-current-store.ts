import { makeAutoObservable } from 'mobx';
import StreetcodesApi from '@api/streetcode/streetcodes.api';

import Streetcode from '@/models/streetcode/streetcode-types.model';

export default class StreetcodeStore {
    public errorStreetCodeId = -1;

    public currentStreetcode = this.errorStreetCodeId;

    public streetcodeUrl = '';

    constructor() {
        makeAutoObservable(this);
    }

    public set setStreetCode(streetcode: Streetcode) {
        this.currentStreetcode = streetcode.id;
    }

    public setCurrentStreetcodeId = async (url: string): Promise<Streetcode | undefined> => {
        try {
            if (await StreetcodesApi.existWithUrl(url)) {
                const streetcode = await StreetcodesApi.getByUrl(url);
                if (streetcode !== null) {
                    this.setStreetCode = streetcode;
                    return streetcode;
                }
            }
        } catch (error) { }
    };

    public get getStreetCodeId() {
        return this.currentStreetcode;
    }
}
