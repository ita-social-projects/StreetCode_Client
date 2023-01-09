import Toponym from "@models/toponyms/toponym.model";
import { makeAutoObservable, runInAction } from "mobx";
import toponymsApi from "@api/map/toponyms.api";

export default class ToponymStore {
    public ToponymMap = new Map<number, Toponym>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setInternalMap = (toponyms: Toponym[]) => {
        toponyms.forEach(this.setItem);
    }

    private setItem = (toponym: Toponym) => {
        this.ToponymMap.set(toponym.id, toponym);
    }

    public getToponymArray = () => {
        return Array.from(this.ToponymMap.values());
    }

    public fetchToponym = async (id: number) => {
        try {
            const toponym = await toponymsApi.getById(id);
            this.setItem(toponym);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public fetchToponyms = async () => {
        try {
            const toponyms = await toponymsApi.getAll();
            this.setInternalMap(toponyms);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public createToponym = async (toponym: Toponym) => {
        try {
            await toponymsApi.create(toponym);
            this.setItem(toponym);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public updateToponym = async (toponym: Toponym) => {
        try {
            await toponymsApi.update(toponym);
            runInAction(() => {
                const updatedToponym = {
                    ...this.ToponymMap.get(toponym.id),
                    ...toponym
                };
                this.setItem(updatedToponym as Toponym);
            });
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public deleteToponym = async (toponymId: number) => {
        try {
            await toponymsApi.delete(toponymId);
            runInAction(() => {
                this.ToponymMap.delete(toponymId);
            });
        }
        catch (error: any) {
            console.log(error);
        }
    }
}