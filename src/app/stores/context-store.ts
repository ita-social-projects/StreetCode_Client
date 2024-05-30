import { makeAutoObservable, runInAction } from 'mobx';
import Context, { StreetcodeContextUpdate, ContextCreate } from '@models/additional-content/context.model';
import ContextsApi from '@api/additional-content/contexts.api';

export default class ContextStore {
    public AllContextsMap = new Map<number, Context>();

    public ContextMap = new Map<number, Context>();

    public ContextCatalogMap = new Map<number, Context>();

    public ContextToDeleteArray: StreetcodeContextUpdate[] = [];

    public constructor() {
        makeAutoObservable(this);
    }

    private set setInternalAllTags(contexts: Context[]) {
        this.AllContextsMap.clear();
        contexts.forEach(this.setAllItem);
    }

    private set setInternalMap(contexts: Context[]) {
        this.ContextMap.clear();
        contexts.forEach(this.setItem);
    }

    private set setInternalCatalog(contexts: Context[]) {
        contexts.forEach(this.setCatalogItem);
    }

    private setAllItem = (context: Context) => {
        this.AllContextsMap.set(context.id, context);
    };

    private setItem = (context: Context) => {
        this.ContextMap.set(context.id, context);
    };

    private setCatalogItem = (context: Context) => {
        this.ContextCatalogMap.set(context.id, context);
    };

    public setItemToDelete = (context: StreetcodeContextUpdate) => {
        this.ContextToDeleteArray.push(context);
    };

    public deleteItemFromArrayToDelete = (title: string) => {
        this.ContextToDeleteArray = this.ContextToDeleteArray.filter((t) => t.title !== title);
    };

    get getContextToDeleteArray() {
        return this.ContextToDeleteArray;
    }

    get getAllContextsArray() {
        return Array.from(this.AllContextsMap.values());
    }

    get getContextArray() {
        return Array.from(this.ContextMap.values());
    }

    get getContextCatalogArray() {
        return Array.from(this.ContextCatalogMap.values());
    }

    public fetchAllContexts = async () => {
        try {
            this.setInternalAllTags = await ContextsApi.getAll();
        } catch (error: unknown) { /* empty */ }
    };

    public fetchContexts = async () => {
        try {
            this.setInternalMap = await ContextsApi.getAll();
        } catch (error: unknown) { /* empty */ }
    };

    public createContext = async (context: ContextCreate) => {
        try {
            const newcontext: Context = await ContextsApi.create(context);
            this.setItem(newcontext);
        } catch (error: unknown) { /* empty */ }
    };

    public updateContext = async (context: Context) => {
        try {
            await ContextsApi.update(context);
            runInAction(() => {
                const updatedContext = {
                    ...this.ContextMap.get(context.id),
                    ...context,
                };
                this.setItem(updatedContext as Context);
            });
        } catch (error: unknown) { /* empty */ }
    };

    public deleteContext = async (contextId: number) => {
        try {
            await ContextsApi.delete(contextId);
            runInAction(() => {
                this.ContextMap.delete(contextId);
            });
        } catch (error: unknown) { /* empty */ }
    };
}