import { makeAutoObservable } from 'mobx';
import sourcesApi from '@api/sources/sources.api';
import { SourceCategory, SourceCategoryAdmin } from '@models/sources/sources.model';

export default class SourcesAdminStore {
    public srcSourcesMap = new Map<number, SourceCategoryAdmin>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setSource = (srcCategory: SourceCategoryAdmin) => {
        this.srcSourcesMap.set(srcCategory.id, srcCategory);
    };

    private set setInternalSourceCategories(src: SourceCategoryAdmin[]) {
        src.forEach(this.setSource);
    }

    get getSourcesAdmin() {
        return Array.from(this.srcSourcesMap.values());
    }

    public fetchSourceCategories = async () => {
        try {
            this.setInternalSourceCategories = await sourcesApi.getAllCategories();
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public deleteSourceCategory = async (srcId: number) => {
        this.srcSourcesMap.delete(srcId);
        try {
            await sourcesApi.delete(srcId);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public addSourceCategory = async (sourceItem: SourceCategoryAdmin) => {
        try {
            await sourcesApi.create(sourceItem).then((created) => {this.setSource(created);
                console.log(created)});
        } catch (e: unknown) {
            console.log(e);
        }
    };

    public updateSourceCategory = async (sourceItem: SourceCategoryAdmin) => {
        this.srcSourcesMap.set(sourceItem.id, sourceItem);
        try {
            await sourcesApi.update(sourceItem);
        } catch (e: unknown) {
            console.log(e);
        }
    };
}
