import { makeAutoObservable } from 'mobx';
import StreetcodeArtApi from '@api/media/streetcode-art.api';
import { ModelState } from '@models/enums/model-state';

import StreetcodeArt, { StreetcodeArtCreateUpdate } from '@/models/media/streetcode-art.model';
import Art from "@models/media/art.model"

export default class StreetcodeArtStore {
    public streetcodeArtMap = new Map<number, StreetcodeArt>();

    private page = 1;

    private readonly pageSize = 6;

    public constructor() {
        makeAutoObservable(this);
    }

    public setItem = (art: StreetcodeArt) => {
        this.streetcodeArtMap.set(art.art.id, art);
    };

    private set setInternalStreetcodeArtMap(streetcodeArt: StreetcodeArt[]) {
        this.streetcodeArtMap.clear();
        streetcodeArt.forEach(this.setItem);
    }

    private set setNextPageToArtMap(streetcodeArt: StreetcodeArt[]) {
        streetcodeArt.forEach(this.setItem);
    }

    get getStreetcodeArtArray() {
        return Array.from(this.streetcodeArtMap.values());
    }

    get getStreetcodeArtsToDelete() {
        return (Array.from(this.streetcodeArtMap.values()) as StreetcodeArtCreateUpdate[])
            .filter((art) => art.modelState === ModelState.Deleted);
    }

    public fetchStreetcodeArtsByStreetcodeId = async (streetcodeId: number) => {
        try {
            this.setInternalStreetcodeArtMap = await StreetcodeArtApi
                .getStreetcodeArtsByStreetcodeId(streetcodeId);
        } catch (error: unknown) { /* empty */ }
    };

    public fetchNextPageOfArtsByStreetcodeId = async (streetcodeId: number) => {
        try {
            const arrayOfArts = await StreetcodeArtApi
                .getPageOfArtsByStreetcodeId(streetcodeId, this.page, this.pageSize);

            if (arrayOfArts.length !== 0) {
                this.setNextPageToArtMap = arrayOfArts;
                this.page += 1;
            } else {
                throw new Error('No more arts to load');
            }
        } catch (error: unknown) { console.log(error); }
    };
}
