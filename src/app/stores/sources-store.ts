import { makeAutoObservable, runInAction } from 'mobx';
import sourcesApi from '@api/sources/sources.api';
import { SourceCategory, StreetcodeCategoryContent } from '@models/sources/sources.model';

export default class SourcesStore {
    public srcCategoriesMap = new Map<number, SourceCategory>();
    public srcCategoriesContentMap = new Map<number, StreetcodeCategoryContent>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setCategoryItem = (srcCategory: SourceCategory) => {
        this.srcCategoriesMap.set(srcCategory.id, srcCategory);
    };

    public setInternalCategoriesMap(srcCategories: SourceCategory[]) {
        this.srcCategoriesMap.clear();
        this.srcCategoriesContentMap.clear();
        srcCategories.forEach(this.setCategoryItem);
    }

    get getSrcCategoriesArray() {
        return Array.from(this.srcCategoriesMap.values());
    }

    public fetchSrcCategoriesByStreetcodeId = async (streetcodeId: number) => {
        try {
            this.setInternalCategoriesMap(await sourcesApi.getCategoriesByStreetcodeId(streetcodeId));
            this.srcCategoriesMap.forEach(async (value, key) => {
                const content = await sourcesApi.getCategoryContentByStreetcodeId(streetcodeId, key);
                this.srcCategoriesContentMap.set(key, content);
            });
        } catch (error: unknown) {
            console.error(error);
        }
    };

    public fetchSrcCategoriesAll = async () => {
        try {
            this.setInternalCategoriesMap(await sourcesApi.getAllCategories());
        } catch (error: unknown) {
            console.error(error);
        }
    };

    public createSourceCategory = async (srcCategory: SourceCategory) => {
        try {
            await sourcesApi.create(srcCategory);
            this.setCategoryItem(srcCategory);
        } catch (error: unknown) {
            console.error(error);
        }
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
        } catch (error: unknown) {
            console.error(error);
        }
    };

    public deleteSourceCategory = async (SourceCategoryId: number) => {
        try {
            await sourcesApi.delete(SourceCategoryId);
            runInAction(() => {
                this.srcCategoriesMap.delete(SourceCategoryId);
            });
        } catch (error: unknown) {
            console.error(error);
        }
    };
}
