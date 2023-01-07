import { SourceCategory, SourceSubCategory } from '@models/sources/sources.model';
import { makeAutoObservable, runInAction } from 'mobx';
import sourcesApi from '@api/sources/sources.api';

export default class SourcesStore {
    public srcCategoriesMap = new Map<number, SourceCategory>();
    public srcSubCategoriesMap = new Map<number, SourceSubCategory>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setCategoryItem = (srcCategory: SourceCategory) => {
        this.srcCategoriesMap.set(srcCategory.id, srcCategory);
    }

    private setSubCategoryItem = (srcSubCategory: SourceSubCategory) => {
        this.srcSubCategoriesMap.set(srcSubCategory.id, srcSubCategory);
    }

    private set setInternalCategoriesMap (srcCategories: SourceCategory[]) {
        srcCategories.forEach(this.setCategoryItem);
    }

    private set setInternalSubCategoriesMap (srcSubCategories: SourceSubCategory[]) {
        srcSubCategories.forEach(this.setSubCategoryItem);
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
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public fetchSrcCategories = async () => {
        try {
            this.setInternalCategoriesMap =
                await sourcesApi.getAllCategories();
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public fetchSrcCategoriesByStreetcodeId = async (streetcodeId: number) => {
        try {
            this.setInternalCategoriesMap =
                await sourcesApi.getCategoriesByStreetcodeId(streetcodeId);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public fetchSrcSubCategoriesByCategoryId = async (categoryId: number)
        : Promise<SourceSubCategory[] | undefined> => {
        try {
            const srcSubCategories =
                await sourcesApi.getSubCategoriesByCategoryId(categoryId);

            console.log(categoryId)

            this.setInternalSubCategoriesMap = srcSubCategories ?? [];
            return srcSubCategories;
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public createSourceCategory = async (SourceCategory: SourceCategory) => {
        try {
            await sourcesApi.create(SourceCategory);
            this.setCategoryItem(SourceCategory);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public updateSourceCategory = async (SourceCategory: SourceCategory) => {
        try {
            await sourcesApi.update(SourceCategory);
            runInAction(() => {
                const updatedSourceCategory = {
                    ...this.srcSubCategoriesMap.get(SourceCategory.id),
                    ...SourceCategory
                };
                this.setCategoryItem(updatedSourceCategory as SourceCategory);
            });
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public deleteSourceCategory = async (SourceCategoryId: number) => {
        try {
            await sourcesApi.delete(SourceCategoryId);
            runInAction(() => {
                this.srcSubCategoriesMap.delete(SourceCategoryId);
            });
        }
        catch (error: any) {
            console.log(error);
        }
    }
}