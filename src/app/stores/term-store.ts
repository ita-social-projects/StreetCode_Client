import { makeAutoObservable, runInAction } from 'mobx';
import termsApi from '@api/streetcode/text-content/terms.api';
import { Term } from '@models/streetcode/text-contents.model';

export default class TermStore {
    public TermMap = new Map<number, Term>();

    public constructor() {
        makeAutoObservable(this);
    }

    public setInternalMap = (terms: Term[]) => {
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
        } catch (error: unknown) {}
    };

    public createTerm = async (term: Term) => {
        try {
            let newData = null as unknown as Term;
            await termsApi.create(term).then(
                (response) => {
                    this.setItem(response);
                    newData = response;
                },
            );
            return newData;
        } catch (error: unknown) {
            return null;
        }
    };

    public updateTerm = async (id: number, term: Term) => {
        try {
            if (id !== 0) {
                await termsApi.update(term);
                runInAction(() => {
                    const updatedTerm = {
                        ...this.TermMap.get(term.id),
                        ...term,
                    };
                    this.setItem(updatedTerm as Term);
                });
            }
        } catch (error: unknown) {}
    };

    public deleteTerm = async (termId: number) => {
        try {
            if (termId !== 0) {
                await termsApi.delete(termId);
                runInAction(() => {
                    this.TermMap.delete(termId);
                });
            }
        } catch (error: unknown) {}
    };
}
