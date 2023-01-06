import { makeAutoObservable } from "mobx";

interface ModalStateList {
    sources: boolean;
    facts: boolean;
}

type ModalType = 'sources' | 'facts';

export default class ModalStore {
    public modalsState: ModalStateList = {
        sources: false,
        facts: false,
    }

    public constructor() {
        makeAutoObservable(this);
    }

    public setModal = (modalName: ModalType, opened?: boolean) => {
        this.modalsState = {
            ...this.modalsState,
            ...{[modalName]: opened ?? !this.modalsState[modalName]}
        };
    }
}