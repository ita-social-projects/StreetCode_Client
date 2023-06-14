import { makeAutoObservable, runInAction } from 'mobx';
import factsApi from '@api/streetcode/text-content/facts.api';
import { Fact, FactCreate } from '@models/streetcode/text-contents.model';

export default class FactsStore {
    public factMap = new Map<number, Fact>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setInternalMap = (facts: Fact[]) => {
        facts.forEach(this.setItem);
    };

    public addFact = (fact: Fact) => {
        this.setItem(fact);
    };

    public deleteFactFromMap = (factId: number) => {
        this.factMap.delete(factId);
    };

    public updateFactInMap = (fact: Fact) => {
        this.setItem(fact);
    };

    private setItem = (fact: Fact) => {
        this.factMap.set(fact.id, fact);
    };

    get getFactArray() {
        return Array.from(this.factMap.values());
    }

    public fetchFactsByStreetcodeId = async (streetcodeId: number): Promise<Fact[]> => {
        try {
            const facts = await factsApi.getFactsByStreetcodeId(streetcodeId);
            this.factMap.clear();
            this.setInternalMap(facts);
            return facts;
        } catch (error: unknown) {}
        return Array<Fact>(0);
    };

    public createFact = async (fact: Fact) => {
        try {
            await factsApi.create(fact);
            this.setItem(fact);
        } catch (error: unknown) {}
    };

    public updateFact = async (fact: Fact) => {
        try {
            await factsApi.update(fact);
            runInAction(() => {
                const updatedFact = {
                    ...this.factMap.get(fact.id),
                    ...fact,
                };
                this.setItem(updatedFact as Fact);
            });
        } catch (error: unknown) {}
    };

    public deleteFact = async (factId: number) => {
        try {
            await factsApi.delete(factId);
            runInAction(() => {
                this.factMap.delete(factId);
            });
        } catch (error: unknown) {}
    };
}
