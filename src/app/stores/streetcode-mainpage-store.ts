import { makeAutoObservable, runInAction } from 'mobx';
import StreetcodesApi from '@api/streetcode/streetcodes.api';
import { useQuery } from '@tanstack/react-query';

import { StreetcodeMainPage } from '@/models/streetcode/streetcode-types.model';

export default class StreetcodesMainPageStore {
    public streetcodesMap = new Map<number, StreetcodeMainPage>();

    constructor() {
        makeAutoObservable(this);
    }

    public setItem = (streetcodeMainPage: StreetcodeMainPage) => {
        this.streetcodesMap.set(streetcodeMainPage.id, streetcodeMainPage);
    };

    public fetchStreetcodesMainPage = async (page: number, pageSize: number) => {
        useQuery(
            {
                queryKey: ['streetcodesMainPage', page, pageSize],
                queryFn: () => StreetcodesApi.getPageMainPage(page, pageSize).then((streetcodesMainPage) => {
                    runInAction(() => {
                        streetcodesMainPage.forEach(this.setItem);
                    });
                }),
            },
        );
    };

    get getStreetcodesArray() {
        return Array.from(this.streetcodesMap.values());
    }
}
