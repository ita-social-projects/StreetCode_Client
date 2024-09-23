import { makeAutoObservable, runInAction } from 'mobx';
import tagsApi from '@api/additional-content/tags.api';
import Tag, { StreetcodeTagUpdate, TagCreate } from '@models/additional-content/tag.model';
import { PaginationInfo } from '@/models/pagination/pagination.model';

export default class TagsStore {
    public AllTagsMap = new Map<number, Tag>();

    public TagMap = new Map<number, Tag>();

    public TagCatalogMap = new Map<number, Tag>();

    public TagToDeleteArray: StreetcodeTagUpdate[] = [];

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

    private set setInternalAllTags(tags: Tag[]) {
        this.AllTagsMap.clear();
        tags.forEach(this.setAllItem);
    }

    private set setInternalMap(tags: Tag[]) {
        this.TagMap.clear();
        tags.forEach(this.setItem);
    }

    private set setInternalCatalog(tags: Tag[]) {
        tags.forEach(this.setCatalogItem);
    }

    private setAllItem = (tag: Tag) => {
        this.AllTagsMap.set(tag.id, tag);
    };

    private setItem = (tag: Tag) => {
        this.TagMap.set(tag.id, tag);
    };

    private setCatalogItem = (tag: Tag) => {
        this.TagCatalogMap.set(tag.id, tag);
    };

    public setItemToDelete = (tag: StreetcodeTagUpdate) => {
        this.TagToDeleteArray.push(tag);
    };

    public deleteItemFromArrayToDelete = (title: string) => {
        this.TagToDeleteArray = this.TagToDeleteArray.filter((t) => t.title !== title);
    };

    get getTagToDeleteArray() {
        return this.TagToDeleteArray;
    }

    get getAllTagsArray() {
        return Array.from(this.AllTagsMap.values());
    }

    get getTagArray() {
        return Array.from(this.TagMap.values());
    }

    get getTagCatalogArray() {
        return Array.from(this.TagCatalogMap.values());
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

    public fetchAllTags = async (pageSize?: number) => {
        await tagsApi.getAll(this.PaginationInfo.CurrentPage, pageSize ?? this.paginationInfo.PageSize)
            .then((resp) => {
                this.PaginationInfo.TotalItems = resp.totalAmount;
                this.setInternalAllTags = resp.tags;
            })
            .catch((error) => console.error(error));
    };

    public fetchTagByStreetcodeId = async (streetcodeId: number) => {
        try {
            this.setInternalMap = await tagsApi.getTagsByStreetcodeId(streetcodeId);
        } catch (error: unknown) { /* empty */ }
    };

    public fetchTagCatalogByStreetcodeId = async (streetcodeId: number) => {
        try {
            this.setInternalCatalog = await tagsApi.getTagsByStreetcodeId(streetcodeId);
        } catch (error: unknown) { /* empty */ }
    };

    public createTag = async (tag: TagCreate) => {
        try {
            const newtag: Tag = await tagsApi.create(tag);
            this.setItem(newtag);
        } catch (error: unknown) { /* empty */ }
    };

    public updateTag = async (tag: Tag) => {
        try {
            await tagsApi.update(tag);
            runInAction(() => {
                const updatedTag = {
                    ...this.TagMap.get(tag.id),
                    ...tag,
                };
                this.setItem(updatedTag as Tag);
            });
        } catch (error: unknown) { /* empty */ }
    };

    public deleteTag = async (tagId: number) => {
        try {
            await tagsApi.delete(tagId);
            runInAction(() => {
                this.TagMap.delete(tagId);
            });
        } catch (error: unknown) { /* empty */ }
    };
}
