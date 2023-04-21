import { makeAutoObservable } from 'mobx';
import { Certificate } from 'crypto';

import { StreetcodeCategoryContent } from '@/models/sources/sources.model';

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
        this.streetcodeCategoryContents.push(category);
    }

    public updateElement(index:number, category: StreetcodeCategoryContent) {
        this.streetcodeCategoryContents[index] = category;
    }

    public removeSourceCategoryContent(index:number) {
        this.streetcodeCategoryContents.splice(index, 1);
    }
}
