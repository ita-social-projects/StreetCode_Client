import { makeAutoObservable } from "mobx";

interface ModalStateList {
    sources: boolean;
    facts: boolean;
    audio: boolean;
}

type ModalType = 'sources' | 'facts' | 'audio';

export default class ModalStore {
    public modalsState: ModalStateList = {
        sources: false,
        facts: false,
        audio: false,
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