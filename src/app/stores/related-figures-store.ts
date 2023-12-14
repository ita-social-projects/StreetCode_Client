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

    public set setInternalRelatedFiguresMap(relatedFigures: RelatedFigure[]) {
        this.relatedFiguresMap.clear();
        relatedFigures.forEach(this.setRelatedFigureItem);
    }

    get getRelatedFiguresArray() {
        return Array.from(this.relatedFiguresMap.values());
    }

    public fetchRelatedFiguresByStreetcodeId = async (streetcodeId: number) => {
        try {
            this.setInternalRelatedFiguresMap = await relatedFiguresApi.getByStreetcodeId(streetcodeId);
        } catch (error: unknown) {}
    };

    public fetchRelatedFiguresByTagId = async (tagId: number) => {
        try {
            this.setInternalRelatedFiguresMap = await relatedFiguresApi.getByTagId(tagId);
        } catch (error: unknown) {}
    };

    public createRelatedFigure = async (relatedFigure: RelatedFigure) => {
        try {
            await relatedFiguresApi.create(relatedFigure);
            this.setRelatedFigureItem(relatedFigure);
        } catch (error: unknown) {}
    };

    public updateRelatedFigure = async (relatedFigure: RelatedFigure) => {
        try {
            await relatedFiguresApi.update(relatedFigure);
            runInAction(() => {
                const updatedRelatedFigure = {
                    ...this.relatedFiguresMap.get(relatedFigure.id),
                    ...relatedFigure,
                };
                this.setRelatedFigureItem(updatedRelatedFigure as RelatedFigure);
            });
        } catch (error: unknown) {}
    };

    public deleteRelatedFigure = async (relatedFigureId: number) => {
        try {
            await relatedFiguresApi.delete(relatedFigureId);
            runInAction(() => {
                this.relatedFiguresMap.delete(relatedFigureId);
            });
        } catch (error: unknown) {}
    };
}
