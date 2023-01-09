import TransactionLink from "@models/transactions/transaction-link.model";
import { makeAutoObservable, runInAction } from "mobx";
import transactLinksApi from "@api/transactions/transactLinks.api";

export default class TransactionLinksStore {
    public TransactionLinkMap = new Map<number, TransactionLink>();

    public constructor() {
        makeAutoObservable(this);
    }

    private setInternalMap = (transactionLinks: TransactionLink[]) => {
        transactionLinks.forEach(this.setItem);
    }

    private setItem = (transactionLink: TransactionLink) => {
        this.TransactionLinkMap.set(transactionLink.id, transactionLink);
    }

    public getTransactionLinkArray = () => {
        return Array.from(this.TransactionLinkMap.values());
    }

    public fetchTransactionLink = async (id: number) => {
        try {
            const transactionLink = await transactLinksApi.getById(id);
            this.setItem(transactionLink);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public fetchTransactionLinks = async () => {
        try {
            const transactionLinks = await transactLinksApi.getAll();
            this.setInternalMap(transactionLinks);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public createTransactionLink = async (transactionLink: TransactionLink) => {
        try {
            await transactLinksApi.create(transactionLink);
            this.setItem(transactionLink);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public updateTransactionLink = async (transactionLink: TransactionLink) => {
        try {
            await transactLinksApi.update(transactionLink);
            runInAction(() => {
                const updatedTransactionLink = {
                    ...this.TransactionLinkMap.get(transactionLink.id),
                    ...transactionLink
                };
                this.setItem(updatedTransactionLink as TransactionLink);
            });
        }
        catch (error: any) {
            console.log(error);
        }
    }

    public deleteTransactionLink = async (transactionLinkId: number) => {
        try {
            await transactLinksApi.delete(transactionLinkId);
            runInAction(() => {
                this.TransactionLinkMap.delete(transactionLinkId);
            });
        }
        catch (error: any) {
            console.log(error);
        }
    }
}