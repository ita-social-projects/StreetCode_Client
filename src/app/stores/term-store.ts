import { makeAutoObservable, runInAction } from 'mobx';
import termsApi from '@api/streetcode/text-content/terms.api';
import { Term } from '@models/streetcode/text-contents.model';
import { PaginationInfo } from '@/models/pagination/pagination.model';

export default class TermStore {
    public TermMap = new Map<number, Term>();

    private defaultPageSize = 10;

    private paginationInfo: PaginationInfo = {
        PageSize: this.defaultPageSize,
        TotalPages: 1,
        TotalItems: 1,
        CurrentPage: 1,
    };

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

    public setCurrentPage(currPage: number) {
        this.paginationInfo.CurrentPage = currPage;
    }

    public set PaginationInfo(paginationInfo: PaginationInfo) {
        this.paginationInfo = paginationInfo;
    }

    public get PaginationInfo(): PaginationInfo {
        return this.paginationInfo;
    }

    public fetchTerms = async (title = '', pageSize?: number, currentPage?: number) => {
        try {
            const page = currentPage ?? (title ? 1 : this.PaginationInfo.CurrentPage);
            const size = pageSize ?? this.PaginationInfo.PageSize;

            const response = await termsApi.getAll(page, size, title);

            if (response && response.totalAmount !== undefined && Array.isArray(response.terms)) {
                runInAction(() => {
                    this.PaginationInfo.TotalItems = response.totalAmount;
                    this.PaginationInfo.TotalPages = Math.ceil(
                        response.totalAmount / size
                    );
                    this.PaginationInfo.CurrentPage = page;
                    this.setInternalMap(response.terms);
                });
                return response.terms;
            } else {
                console.warn('Невірна відповідь від API або відсутні терміни.');
            }
        } catch (error) {
            console.error('Помилка при отриманні термінів:', error);
        }
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
