import { makeAutoObservable } from 'mobx';
import StreetcodesApi from '@api/streetcode/streetcodes.api';

import { StreetcodeMainPage } from '@/models/streetcode/streetcode-types.model';

export default class StreetcodesMainPageStore {
    public streetcodes = new Array<StreetcodeMainPage>();

    private page = 1;

    private readonly pageSize = 3;

    private shuffleSeed = Math.floor(Date.now() / 1000);

    constructor() {
        makeAutoObservable(this);
    }

    public fetchStreetcodesMainPageAll = async () => {
        StreetcodesApi.getAllMainPage()
            .then((value) => {
                this.streetcodes = value.map((s) => ({ id: s.id, title: s.title, teaser: s.teaser, alias: s.alias, text: s.text, imageId: s.imageId, transliterationUrl: s.transliterationUrl }));
            }).catch((error) => {});
    };

    public fetchNextPageOfStreetcodesMainPage = async () => {
        const currentPage = this.page;
        const arrayOfStreetcodes = await StreetcodesApi.getPageMainPage(currentPage, this.pageSize, this.shuffleSeed);

        if (arrayOfStreetcodes.length !== 0) {
            this.page = currentPage + 1;
            return arrayOfStreetcodes;
        }

        throw new Error('No more streetcodes to load');
    };

    get getStreetcodesArray() {
        return this.streetcodes;
    }
}
