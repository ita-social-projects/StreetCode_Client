import { makeAutoObservable } from 'mobx';

interface Sources {
    isOpen: boolean;
    body?: JSX.Element | undefined;
}

export default class SourcesStore {
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
