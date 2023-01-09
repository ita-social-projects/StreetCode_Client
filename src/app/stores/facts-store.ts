import {Fact} from "@models/streetcode/text-contents.model";
import { makeAutoObservable, runInAction } from "mobx";
import factsApi from "@api/streetcode/text-content/facts.api";

export default class FactsStore {
    public factMap = new Map<number, Fact>();
    
    public constructor() {
        makeAutoObservable(this);
    }
    
    private setInternalMap = (facts: Fact[]) => {
        facts.forEach(this.setItem);
    }
    
    private setItem = (fact: Fact) => {
        this.factMap.set(fact.id, fact);
    }

    public getFactArray = () => {
        return Array.from(this.factMap.values());
    }

    public fetchFact = async (id: number) => {
        try {
            const fact = await factsApi.getById(id);
            this.setItem(fact);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public fetchFacts = async () => {
        try {
            const facts = await factsApi.getAll();
            this.setInternalMap(facts);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public fetchFactByStreetcodeId = async (streetcodeId: number) => {
        try {
            const fact = await factsApi.getByStreetcodeId(streetcodeId);
            runInAction(() => {
                this.factMap.set(streetcodeId, fact);
            });
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public createFact = async (fact: Fact) => {
        try {
            await factsApi.create(fact);
            this.setItem(fact);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public updateFact = async (fact: Fact) => {
        try {
            await factsApi.update(fact);
            runInAction(() => {
                const updatedFact = {
                    ...this.factMap.get(fact.id),
                    ...fact
                };
                this.setItem(updatedFact as Fact);
            });
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public deleteFact = async (factId: number) => {
        try {
            await factsApi.delete(factId);
            runInAction(() => {
                this.factMap.delete(factId);
            });
        }
        catch (error: any) {
            console.log(error);
        }
    }
}