import { makeAutoObservable, runInAction } from 'mobx';
import relatedFiguresApi from '@api/streetcode/related-figure.api';
import Tag from '@models/additional-content/tag.model';
import RelatedFigure from '@models/streetcode/related-figure.model';

export default class RelatedFiguresStore {
    public relatedFiguresMap = new Map<number, RelatedFigure>();

    private currentStreetCodeTags = new Map<number, Tag>();

    private setActiveTagIdFn: ((tagId: number) => void) | null = null;

    private setShowAllTagsFn: ((showAll: boolean) => void) | null = null;

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

    public setCurrentStreetcodeTags = (tags: Tag[]) => {
        tags.forEach((tag) => {
            this.currentStreetCodeTags.set(tag.id, tag);
        });
    };

    public getCommonTags(relatedFigureId: number): Tag[] {
        const relatedFigure = this.relatedFiguresMap.get(relatedFigureId);
        if (!relatedFigure) {
            return [];
        }
        const streetCodeTags = this.currentStreetCodeTags;

        return relatedFigure.tags.filter((tag) => Array.from(streetCodeTags.values())
            .some((streetCodeTag) => streetCodeTag.id === tag.id));
    }

    public setSetActiveTagIdFn(fn: (tagId: number) => void) {
        this.setActiveTagIdFn = fn;
    }

    public getSetActiveTagIdFn() {
        return this.setActiveTagIdFn || (() => {});
    }

    public setSetShowAllTagsFn(fn: (showAll: boolean) => void) {
        this.setShowAllTagsFn = fn;
    }

    public getSetShowAllTagsFn() {
        return this.setShowAllTagsFn || (() => {});
    }
}
