import {Term} from "@models/streetcode/text-contents.model";
import { makeAutoObservable, runInAction } from "mobx";
import termsApi from "@api/terms.api";

export default class TermStore {
    public TermMap = new Map<number, Term>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setInternalMap = (terms: Term[]) => {
        terms.forEach(this.setItem);
    }

    private setItem = (term: Term) => {
        this.TermMap.set(term.id, term);
    }

    public getTermArray = () => {
        return Array.from(this.TermMap.values());
    }

    public fetchTerm = async (id: number) => {
        try {
            const term = await termsApi.getById(id);
            this.setItem(term);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public fetchTerms = async () => {
        try {
            const terms = await termsApi.getAll();
            this.setInternalMap(terms);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public createTerm = async (term: Term) => {
        try {
            await termsApi.create(term);
            this.setItem(term);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public updateTerm = async (term: Term) => {
        try {
            await termsApi.update(term);
            runInAction(() => {
                const updatedTerm = {
                    ...this.TermMap.get(term.id),
                    ...term
                };
                this.setItem(updatedTerm as Term);
            });
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public deleteTerm = async (termId: number) => {
        try {
            await termsApi.delete(termId);
            runInAction(() => {
                this.TermMap.delete(termId);
            });
        }
        catch (error: any) {
            console.log(error);
        }
    }
}