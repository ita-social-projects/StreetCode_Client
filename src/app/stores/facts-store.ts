import { makeAutoObservable, runInAction } from 'mobx';
import factsApi from '@api/streetcode/text-content/facts.api';
import { ModelState } from '@models/enums/model-state';
import { Fact, FactCreate, FactUpdate } from '@models/streetcode/text-contents.model';

import { ImageDetails } from '@/models/media/image.model';

export default class FactsStore {
    public factMap = new Map<number, Fact>();

    public factImageDetailsMap = new Map<number, ImageDetails>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setInternalMap = (facts: Fact[]) => {
        facts.forEach((item) => {
            const updatedItem: FactUpdate = {
                ...item,
                isPersisted: true,
                modelState: ModelState.Updated,
            };

            this.setItem(updatedItem);
        });
    };

    public setImageDetails = (fact: FactCreate, imageDetailId: number) => {
        this.factImageDetailsMap.set(fact.imageId, { id: imageDetailId,
                                                     imageId: fact.imageId,
                                                     alt: fact.imageDescription,
                                                     title: '' });
    };

    public addFact = (fact: Fact) => {
        const factToUpdate: FactUpdate = {
            ...fact,
            modelState: ModelState.Created,
        };

        this.setItem(factToUpdate);
    };

    public deleteFactFromMap = (factId: number) => {
        const fact = this.factMap.get(factId) as FactUpdate;
        if (fact && fact.isPersisted) {
            const factToUpdate: FactUpdate = {
                ...fact,
                modelState: ModelState.Deleted,
            };
            this.setItem(factToUpdate);
        } else {
            this.factMap.delete(factId);
        }
    };

    public updateFactInMap = (fact: FactUpdate) => {
        this.setItem(fact);
        this.factImageDetailsMap.set(
            fact.imageId,
            { id: 0, imageId: fact.imageId, alt: fact.imageDescription, title: '' },
        );
    };

    private setItem = (fact: Fact) => {
        this.factMap.set(fact.id, fact);
    };

    get getFactArray() {
        return (Array.from(this.factMap.values()) as FactUpdate[])
            .filter((item: FactUpdate) => item.modelState !== ModelState.Deleted);
    }

    get getFactArrayToUpdate() {
        return (Array.from(this.factMap.values()) as FactUpdate[])
            .map((item: FactUpdate) => {
                if (item.modelState === ModelState.Created) {
                    return { ...item, id: 0 };
                }
                return item;
            });
    }

    public fetchFactsByStreetcodeId = async (streetcodeId: number): Promise<Fact[]> => {
        try {
            const facts = await factsApi.getFactsByStreetcodeId(streetcodeId);
            this.setInternalMap(facts);
            return facts;
        } catch (error: unknown) {}
        return Array<Fact>(0);
    };

    public createFact = async (fact: Fact) => {
        try {
            await factsApi.create(fact);
            this.setItem(fact);
        } catch (error: unknown) { /* empty */ }
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
        } catch (error: unknown) { /* empty */ }
    };

    public deleteFact = async (factId: number) => {
        try {
            await factsApi.delete(factId);
            runInAction(() => {
                this.factMap.delete(factId);
            });
        } catch (error: unknown) { /* empty */ }
    };
}
