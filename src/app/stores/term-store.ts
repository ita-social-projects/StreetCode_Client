import { makeAutoObservable, runInAction } from 'mobx';
import termsApi from '@api/streetcode/text-content/terms.api';
import { Term } from '@models/streetcode/text-contents.model';

export default class TermStore {
    public TermMap = new Map<number, Term>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setInternalMap = (terms: Term[]) => {
        terms.forEach(this.setItem);
    };

    private setItem = (term: Term) => {
        this.TermMap.set(term.id, term);
    };

    get getTermArray() {
        return Array.from(this.TermMap.values());
    }

    public fetchTerms = async () => {
        try {
            const terms = await termsApi.getAll();
            this.setInternalMap(terms);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    // eslint-disable-next-line class-methods-use-this
    public createTerm = async (id: number, term: Term) => {
        try {
            await termsApi.create(term);
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public updateTerm = async (id: number, term: Term) => {
        try {
            await termsApi.update(id, term);
            if (id !== 0) {
                runInAction(() => {
                    const updatedTerm = {
                        ...this.TermMap.get(term.id),
                        ...term,
                    };
                    this.setItem(updatedTerm as Term);
                });
            }
        } catch (error: unknown) {
            console.log(error);
        }
    };

    public deleteTerm = async (termId: number) => {
        try {
            console.log(termId);
            await termsApi.delete(termId);
            runInAction(() => {
                this.TermMap.delete(termId);
            });
        } catch (error: unknown) {
            console.log(error);
        }
    };
}
