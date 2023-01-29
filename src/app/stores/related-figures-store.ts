import { makeAutoObservable, runInAction } from 'mobx';
import relatedFiguresApi from '@api/streetcode/related-figure.api';
import RelatedFigure from '@models/streetcode/related-figure.model';

export default class RelatedFiguresStore {
    public relatedFiguresMap = new Map<number, RelatedFigure>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setRelatedFigureItem = (relatedFigure: RelatedFigure) => {
        this.relatedFiguresMap.set(relatedFigure.id, relatedFigure);
    };

    private set setInternalRelatedFiguresMap(relatedFigures: RelatedFigure[]) {
        relatedFigures.forEach(this.setRelatedFigureItem);
    }

    public get getRelatedFiguresArray() {
        return Array.from(this.relatedFiguresMap.values());
    }

    public fetchRelatedFigure = async (id: number) => {
        try {
            const relatedFigure = await relatedFiguresApi.getById(id);
            this.setRelatedFigureItem(relatedFigure);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchRelatedFigures = async () => {
        try {
            this.setInternalRelatedFiguresMap = await relatedFiguresApi.getAll();
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchRelatedFiguresByStreetcodeId = async (streetcodeId: number) => {
        try {
            this.setInternalRelatedFiguresMap = await relatedFiguresApi.getByStreetcodeId(streetcodeId);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public createRelatedFigures = async (relatedFigure: RelatedFigure) => {
        try {
            await relatedFiguresApi.create(relatedFigure);
            this.setRelatedFigureItem(relatedFigure);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public updateRelatedFigures = async (relatedFigure: RelatedFigure) => {
        try {
            await relatedFiguresApi.update(relatedFigure);
            runInAction(() => {
                const updatedRelatedFigure = {
                    ...this.relatedFiguresMap.get(relatedFigure.id),
                    ...relatedFigure,
                };
                this.setRelatedFigureItem(updatedRelatedFigure as RelatedFigure);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public deleteRelatedFigure = async (relatedFigureId: number) => {
        try {
            await relatedFiguresApi.delete(relatedFigureId);
            runInAction(() => {
                this.relatedFiguresMap.delete(relatedFigureId);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };
}
