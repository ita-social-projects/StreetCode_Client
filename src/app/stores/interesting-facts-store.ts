import { makeAutoObservable } from 'mobx';

interface InterestingFacts {
    isOpen: boolean;
    body?: JSX.Element | undefined;
}

export default class InterestingFactsStore {
    isOpen = false;

    public constructor() {
        makeAutoObservable(this);
    }

    public openModal = () => {
        this.isOpen = true;
    };

    public closeModal = () => {
        this.isOpen = false;
    };
}
