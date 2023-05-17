import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import sourcesApi from '@api/sources/sources.api';
import { SourceCategoryAdmin } from '@models/sources/sources.model';

export default class SourcesAdminStore {
    public srcSourcesMap = new Map<number, SourceCategoryAdmin>();

    public constructor() {
        makeAutoObservable(this, {
            srcSourcesMap: observable,
            fetchSourceCategories: action,
            addSourceCategory: action,
            deleteSourceCategory: action,
            setInternalSourceCategories: action,
            setSource: action,
            updateSourceCategory: action,
        });
    }

    public setSource = (srcCategory: SourceCategoryAdmin) => {
        this.srcSourcesMap.set(srcCategory.id, srcCategory);
    };

    public setInternalSourceCategories(src: SourceCategoryAdmin[]) {
        src.forEach(this.setSource);
    }

    get getSourcesAdmin() {
        return Array.from(this.srcSourcesMap.values());
    }

    public fetchSourceCategories = async () => {
        try {
            this.setInternalSourceCategories(await sourcesApi.getAllCategories());
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public deleteSourceCategory = async (srcId: number) => {
        try {
            await sourcesApi.delete(srcId);
            runInAction(() => {
                this.srcSourcesMap.delete(srcId);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public addSourceCategory = async (sourceItem: SourceCategoryAdmin) => {
        try {
            await sourcesApi.create(sourceItem).then((created) => {
                this.setSource(created);
            });
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
