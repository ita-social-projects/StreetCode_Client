import { makeAutoObservable, runInAction } from 'mobx';
import sourcesApi from '@api/sources/sources.api';
import { SourceCategory, SourceSubCategory } from '@models/sources/sources.model';

export default class SourcesStore {
    public srcCategoriesMap = new Map<number, SourceCategory>();

    public srcSubCategoriesMap = new Map<number, SourceSubCategory>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setCategoryItem = (srcCategory: SourceCategory) => {
        this.srcCategoriesMap.set(srcCategory.id, srcCategory);
    };

    private setSubCategoryItem = (srcSubCategory: SourceSubCategory) => {
        this.srcSubCategoriesMap.set(srcSubCategory.id, srcSubCategory);
    };

    private set setInternalCategoriesMap(srcCategories: SourceCategory[]) {
        srcCategories.forEach(this.setCategoryItem);
    }

    public get getSrcCategoriesArray() {
        return Array.from(this.srcCategoriesMap.values());
    }

    public get getSrcSubCategoriesArray() {
        return Array.from(this.srcSubCategoriesMap.values());
    }

    public fetchSrcCategory = async (id: number) => {
        try {
            const srcCategory = await sourcesApi.getById(id);
            this.setCategoryItem(srcCategory);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchSrcCategories = async () => {
        try {
            this.setInternalCategoriesMap = await sourcesApi.getAllCategories();
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchSrcCategoriesByStreetcodeId = async (streetcodeId: number) => {
        try {
            this.setInternalCategoriesMap = await sourcesApi.getCategoriesByStreetcodeId(streetcodeId);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchSrcSubCategoriesByCategoryId = async (categoryId: number)
        : Promise<SourceSubCategory[] | undefined> => {
        try {
            const srcSubCategories = await sourcesApi.getSubCategoriesByCategoryId(categoryId);

            srcSubCategories?.forEach(this.setSubCategoryItem);
            return srcSubCategories;
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public createSourceCategory = async (srcCategory: SourceCategory) => {
        try {
            await sourcesApi.create(srcCategory);
            this.setCategoryItem(srcCategory);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public updateSourceCategory = async (srcCategory: SourceCategory) => {
        try {
            await sourcesApi.update(srcCategory);
            runInAction(() => {
                const updatedSourceCategory = {
                    ...this.srcSubCategoriesMap.get(srcCategory.id),
                    ...srcCategory,
                };
                this.setCategoryItem(updatedSourceCategory as SourceCategory);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public deleteSourceCategory = async (SourceCategoryId: number) => {
        try {
            await sourcesApi.delete(SourceCategoryId);
            runInAction(() => {
                this.srcSubCategoriesMap.delete(SourceCategoryId);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };
}
