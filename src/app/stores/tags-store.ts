import { makeAutoObservable, runInAction } from 'mobx';
import tagsApi from '@api/additional-content/tags.api';
import Tag, { StreetcodeTagUpdate } from '@models/additional-content/tag.model';

export default class TagsStore {
    public TagMap = new Map<number, Tag>();

    public TagCatalogMap = new Map<number, Tag>();

    public TagToDeleteArray: StreetcodeTagUpdate[] = [];

    public constructor() {
        makeAutoObservable(this);
    }

    private set setInternalMap(tags: Tag[]) {
        this.TagMap.clear();
        tags.forEach(this.setItem);
    }

    private set setInternalCatalog(tags: Tag[]) {
        tags.forEach(this.setCatalogItem);
    }

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

    get getTagArray() {
        return Array.from(this.TagMap.values());
    }

    get getTagCatalogArray() {
        return Array.from(this.TagCatalogMap.values());
    }

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

    public createTag = async (tag: Tag) => {
        try {
            await tagsApi.create(tag);
            this.setItem(tag);
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
