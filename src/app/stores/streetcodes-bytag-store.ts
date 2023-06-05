import { makeAutoObservable } from 'mobx';
import relatedFiguresApi from '@api/streetcode/related-figure.api';
import RelatedFigure from '@models/streetcode/related-figure.model';

export default class StreetcodesByTagStore {
    public streetcodesByTag = new Map<number, RelatedFigure>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setRelatedFigureItem = (relatedFigure: RelatedFigure) => {
        this.streetcodesByTag.set(relatedFigure.id, relatedFigure);
    };

    private set setInternalRelatedFiguresMap(relatedFigures: RelatedFigure[]) {
        this.streetcodesByTag.clear();
        relatedFigures.forEach(this.setRelatedFigureItem);
    }

    get getStreetcodesByTag() {
        return Array.from(this.streetcodesByTag.values());
    }

    public fetchRelatedFiguresByTagId = async (tagId: number) => {
        try {
            this.setInternalRelatedFiguresMap = await relatedFiguresApi.getByTagId(tagId);
        } catch (error: unknown) { /* empty */ }
    };
}