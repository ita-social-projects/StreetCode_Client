import { makeAutoObservable } from 'mobx';
import artsApi from '@api/media/arts.api';
import streetcodeArtApi from '@api/media/streetcode-art.api';
import { ModelState } from '@models/enums/model-state';
import { ArtCreateUpdate } from '@models/media/art.model';
import { StreetcodeArtCreateUpdate } from '@models/media/streetcode-art.model';

export default class ArtStore {
    public arts = new Array<ArtCreateUpdate>();

    public constructor() {
        makeAutoObservable(this);
    }

    get getMaxArtId() {
        const maxId = Math.max(...this.arts.map((a) => a.id));
        return Math.max(maxId, 0);
    }

    public fetchArtsByStreetcodeId = async (streetcodeId: number) => {
        try {
            this.setInternalArts = await streetcodeArtApi
                .getStreetcodeArtsByStreetcodeId(streetcodeId);
        } catch (error: unknown) { /* empty */ }
    };

    private set setInternalArts(fetchedArts: StreetcodeArtCreateUpdate[]) {
        this.arts = fetchedArts.map((fStreetcodeArt) => ({
            ...fStreetcodeArt.art,
            modelState: ModelState.Updated,
            isPersisted: true,
        }));
    }
}
