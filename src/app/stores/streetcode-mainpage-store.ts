import { makeAutoObservable, runInAction } from 'mobx';
import StreetcodesApi from '@api/streetcode/streetcodes.api';
import { useQuery } from '@tanstack/react-query';

import { StreetcodeMainPage } from '@/models/streetcode/streetcode-types.model';

export default class StreetcodesMainPageStore {
    public readonly STREETCODE_MAX_AMOUNT = 10;

    public streetcodesMap = new Map<number, StreetcodeMainPage | undefined>();

    private streetcodesFetchedMap = new Map<number, boolean>();

    constructor() {
        makeAutoObservable(this);
        for (let i = 0; i < this.STREETCODE_MAX_AMOUNT; i += 1) {
            this.streetcodesMap.set(i, undefined);
            this.streetcodesFetchedMap.set(i, false);
        }
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

    public fetchLastStreetcodeWithOffset = async (offset: number) => {
        try {
            let position = offset;
            if (offset < 0) position = this.STREETCODE_MAX_AMOUNT - 1 + offset;
            if (offset > this.STREETCODE_MAX_AMOUNT - 1) return;

            if (this.streetcodesMap.get(position) === undefined && !this.streetcodesFetchedMap.get(position)) {
                const streetcodeMainPage = await StreetcodesApi.getLastWithOffset(position);
                runInAction(() => {
                    this.streetcodesMap.set(position, streetcodeMainPage);
                    this.streetcodesFetchedMap.set(position, true);
                });
            }
        } catch (error) {
            console.error('Error fetching streetcode:', error);
        }
    };

    get getStreetcodesArray() {
        return Array.from(this.streetcodesMap.values());
    }
}
