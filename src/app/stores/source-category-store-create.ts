import { makeAutoObservable } from 'mobx';
import { ModelState } from '@models/enums/model-state';

import { StreetcodeCategoryContent, StreetcodeCategoryContentUpdate } from '@/models/sources/sources.model';

export default class SourceCreateUpdateStreetcode {
    public streetcodeCategoryContents: StreetcodeCategoryContent[] = [];

    public indexUpdate = -1;

    public get ElementToUpdate(): StreetcodeCategoryContent | null {
        if (this.indexUpdate < 0) {
            return null;
        }
        return this.streetcodeCategoryContents[this.indexUpdate];
    }

    public constructor() {
        makeAutoObservable(this);
    }

    public addSourceCategoryContent(category: StreetcodeCategoryContent) {
        const sourceCategoryContentToCreate: StreetcodeCategoryContentUpdate = {
            ...category,
            modelState: ModelState.Created,
        };

        this.streetcodeCategoryContents.push(sourceCategoryContentToCreate);
    }

    public setItem(category: StreetcodeCategoryContent) {
        this.streetcodeCategoryContents.push(category);
    }

    public updateElement(index:number, category: StreetcodeCategoryContent) {
        this.streetcodeCategoryContents[index] = category;
    }

    public removeSourceCategoryContent(index:number) {
        const sourceCategoryContent = this.streetcodeCategoryContents[index] as StreetcodeCategoryContentUpdate;
        if (sourceCategoryContent && sourceCategoryContent.isPersisted) {
            const sourceCategoryContentToUpdate: StreetcodeCategoryContentUpdate = {
                ...sourceCategoryContent,
                modelState: ModelState.Deleted,
            };
            this.streetcodeCategoryContents[index] = sourceCategoryContentToUpdate;
        } else {
            this.streetcodeCategoryContents.splice(index, 1);
        }
    }

    get getCategoryContentsArrayToUpdate() {
        return (this.streetcodeCategoryContents as StreetcodeCategoryContentUpdate[])
            .map((item: StreetcodeCategoryContentUpdate) => {
                if (item.modelState === ModelState.Created) {
                    return { ...item, id: 0 };
                }
                return item;
            });
    }
}
