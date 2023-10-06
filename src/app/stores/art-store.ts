import { makeAutoObservable } from 'mobx';
import artsApi from '@api/media/arts.api';
import { ModelState } from '@models/enums/model-state';
import { ArtCreateUpdate } from '@models/media/art.model';

export default class ArtStore {
    public artMap = new Map<number, ArtCreateUpdate>();

    public constructor() {
        makeAutoObservable(this);
    }

    public setItem = (art: ArtCreateUpdate) => {
        this.artMap.set(art.id, {
            ...art,
            modelState: ModelState.Updated,
            isPersisted: true,
        });
    };

    private set setInternalArtMap(arts: ArtCreateUpdate[]) {
        this.artMap.clear();
        arts.forEach(this.setItem);
    }

    private set setNextPageToArtMap(arts: ArtCreateUpdate[]) {
        arts.forEach(this.setItem);
    }

    get getArtArray() {
        return Array.from(this.artMap.values());
    }

    get getMaxArtId() {
        return Math.max(...this.artMap.keys());
    }

    public fetchArtsByStreetcodeId = async (streetcodeId: number) => {
        try {
            this.setInternalArtMap = await artsApi
                .getAllByStreetcodeId(streetcodeId);
        } catch (error: unknown) {
            console.log('ERRRORRRRRR');/* empty */
        }
    };
}
