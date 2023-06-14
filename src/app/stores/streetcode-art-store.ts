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

    get getStreetcodeArtArray() {
        return Array.from(this.streetcodeArtMap.values());
    }

    public fetchStreetcodeArtsByStreetcodeId = async (streetcodeId: number) => {
        try {
            this.streetcodeArtMap.clear();
            this.setInternalStreetcodeArtMap = await StreetcodeArtApi
                .getStreetcodeArtsByStreetcodeId(streetcodeId);
        } catch (error: unknown) {}
    };
}
