import { makeAutoObservable, runInAction } from 'mobx';
import sourcesApi from '@api/sources/sources.api';
import { SourceCategory, StreetcodeCategoryContent } from '@models/sources/sources.model';
import { PaginationInfo } from '@/models/pagination/pagination.model';

export default class SourcesStore {
    public srcCategoriesMap = new Map<number, SourceCategory>();
    public srcCategoriesContentMap = new Map<number, StreetcodeCategoryContent>();
    
    private defaultPageSize = 10;

    private paginationInfo: PaginationInfo = {
        PageSize: this.defaultPageSize,
        TotalPages: 1,
        TotalItems: 1,
        CurrentPage: 1,
    };

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
    
    public setCurrentPage(currPage: number) {
        this.paginationInfo.CurrentPage = currPage;
    }
    
    public set PaginationInfo(paginationInfo: PaginationInfo) {
        this.paginationInfo = paginationInfo;
    }

    public get PaginationInfo(): PaginationInfo {
        return this.paginationInfo;
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

    public fetchSrcCategoriesAll = async (pageSize?: number) => {
        await sourcesApi.getAllCategories(this.PaginationInfo.CurrentPage, pageSize ?? this.paginationInfo.PageSize)
            .then((resp) => {
                this.PaginationInfo.TotalItems = resp.totalAmount;
                this.setInternalCategoriesMap(resp.categories);
            })
            .catch((error) => console.error(error));
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
