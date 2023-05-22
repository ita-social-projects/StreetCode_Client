import { makeAutoObservable } from 'mobx';
import StreetcodesApi from '@api/streetcode/streetcodes.api';

import { StreetcodeMainPage } from '@/models/streetcode/streetcode-types.model';

export default class StreetcodesMainPageStore {
    public streetcodes = new Array<StreetcodeMainPage>();

    constructor() {
        makeAutoObservable(this);
    }

    public fetchStreetcodesMainPageAll = async () => {
        StreetcodesApi.getAllMainPage()
            .then((value) => {
                this.streetcodes = value.map((s) => ({ id: s.id, title: s.title, teaser: s.teaser, alias: s.alias, text:s.text, imageId: s.imageId, transliterationUrl: s.transliterationUrl }));
            }).catch((error) => {});
    };

    get getStreetcodesArray() {
        return this.streetcodes;
    }
}