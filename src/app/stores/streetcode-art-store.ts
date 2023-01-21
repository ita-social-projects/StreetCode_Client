import { makeAutoObservable } from 'mobx';
import StreetcodeArtApi from '@api/media/streetcode-art.api';

import StreetcodeArt from '@/models/media/streetcode-art.model';

export default class StreetcodeArtStore {
    public streetcodeArtMap = new Map<number, StreetcodeArt>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setItem = (art: StreetcodeArt) => {
        this.streetcodeArtMap.set(art.artId, art);
    };

    private set setInternalStreetcodeArtMap(streetcodeArt: StreetcodeArt[]) {
        streetcodeArt.forEach(this.setItem);
    }

    public get getStreetcodeArtArray() {
        return Array.from(this.streetcodeArtMap.values());
    }

    public fetchStreetcodeArtsByStreetcodeId = async (streetcodeId: number) => {
        try {
            this.setInternalStreetcodeArtMap = await StreetcodeArtApi
                .getStreetcodeArtsByStreetcodeId(streetcodeId);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchArts = async () => {
        try {
            this.setInternalStreetcodeArtMap = await StreetcodeArtApi.getAll();
        } catch (error: unknown) {
            console.log(error);
        }
    };
}
