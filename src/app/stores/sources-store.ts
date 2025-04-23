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

    public fetchSrcCategoriesAll = async (title?: string, pageSize?: number) => {
        try {
            const currentPage = this.PaginationInfo.CurrentPage;
            const size = pageSize ?? this.paginationInfo.PageSize;

            const response = await sourcesApi.getAllCategories(currentPage, size, title);

            if (response && response.totalAmount !== undefined && response.categories) {
                runInAction(() => {
                    this.paginationInfo.TotalItems = response.totalAmount;
                    this.paginationInfo.TotalPages = Math.ceil(response.totalAmount / size);
                    this.setInternalCategoriesMap(response.categories);
                });
            } else {
                console.warn('Невірна відповідь від API або відсутні категорії.');
            }
        } catch (error) {
            console.error('Помилка при отриманні категорій:', error);
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