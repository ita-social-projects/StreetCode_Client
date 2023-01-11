import { makeAutoObservable, runInAction } from 'mobx';
import artsApi from '@api/media/arts.api';
import Art from '@models/media/art.model';

export default class ArtStore {
    public ArtMap = new Map<number, Art>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setInternalMap = (arts: Art[]) => {
        arts.forEach(this.setItem);
    };

    private setItem = (art: Art) => {
        this.ArtMap.set(art.id, art);
    };

    public getArtArray = () => Array.from(this.ArtMap.values());

    public fetchArt = async (id: number) => {
        try {
            const art = await artsApi.getById(id);
            this.setItem(art);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchArts = async () => {
        try {
            const arts = await artsApi.getAll();
            this.setInternalMap(arts);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public createArt = async (art: Art) => {
        try {
            await artsApi.create(art);
            this.setItem(art);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public updateArt = async (art: Art) => {
        try {
            await artsApi.update(art);
            runInAction(() => {
                const updatedArt = {
                    ...this.ArtMap.get(art.id),
                    ...art,
                };
                this.setItem(updatedArt as Art);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public deleteArt = async (artId: number) => {
        try {
            await artsApi.delete(artId);
            runInAction(() => {
                this.ArtMap.delete(artId);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };
}
