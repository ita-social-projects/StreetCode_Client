import { makeAutoObservable, runInAction } from 'mobx';
import sourcesApi from '@api/sources/sources.api';
import { SourceCategory } from '@models/sources/sources.model';

export default class SourcesStore {
    public srcCategoriesMap = new Map<number, SourceCategory>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setCategoryItem = (srcCategory: SourceCategory) => {
        this.srcCategoriesMap.set(srcCategory.id, srcCategory);
    };

    private set setInternalCategoriesMap(srcCategories: SourceCategory[]) {
        this.srcCategoriesMap.clear();
        srcCategories.forEach(this.setCategoryItem);
    }

    get getSrcCategoriesArray() {
        return Array.from(this.srcCategoriesMap.values());
    }

    public fetchSrcCategoriesByStreetcodeId = async (streetcodeId: number) => {
        try {
            this.setInternalCategoriesMap = await sourcesApi.getCategoriesByStreetcodeId(streetcodeId);
        } catch (error: unknown) {}
    };

    public createSourceCategory = async (srcCategory: SourceCategory) => {
        try {
            await sourcesApi.create(srcCategory);
            this.setCategoryItem(srcCategory);
        } catch (error: unknown) {}
    };

    public updateSourceCategory = async (srcCategory: SourceCategory) => {
        try {
            await sourcesApi.update(srcCategory);
            runInAction(() => {
                const updatedSourceCategory = {
                    ...srcCategory,
                };
                this.setCategoryItem(updatedSourceCategory as SourceCategory);
            });
        } catch (error: unknown) {}
    };

    public deleteSourceCategory = async (SourceCategoryId: number) => {
        try {
            await sourcesApi.delete(SourceCategoryId);
            runInAction(() => {
                this.srcCategoriesMap.delete(SourceCategoryId);
            });
        } catch (error: unknown) {}
    };
}
