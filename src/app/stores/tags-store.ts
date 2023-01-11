import { makeAutoObservable, runInAction } from 'mobx';
import tagsApi from '@api/additional-content/tags.api';
import Tag from '@models/additional-content/tag.model';

export default class TagsStore {
    public TagMap = new Map<number, Tag>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setInternalMap = (tags: Tag[]) => {
        tags.forEach(this.setItem);
    };

    private setItem = (tag: Tag) => {
        this.TagMap.set(tag.id, tag);
    };

    public getTagArray = () => Array.from(this.TagMap.values());

    public fetchTag = async (id: number) => {
        try {
            const tag = await tagsApi.getById(id);
            this.setItem(tag);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchTags = async () => {
        try {
            const tags = await tagsApi.getAll();
            this.setInternalMap(tags);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public fetchTagByStreetcodeId = async (streetcodeId: number) => {
        try {
            const tag = await tagsApi.getTagByStreetcodeId(streetcodeId);
            runInAction(() => {
                this.TagMap.set(streetcodeId, tag);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public createTag = async (tag: Tag) => {
        try {
            await tagsApi.create(tag);
            this.setItem(tag);
        } catch (error: unknown) {
            console.log(error);
        }
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
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public deleteTag = async (tagId: number) => {
        try {
            await tagsApi.delete(tagId);
            runInAction(() => {
                this.TagMap.delete(tagId);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };
}
