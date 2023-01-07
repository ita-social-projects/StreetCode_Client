import { makeAutoObservable } from "mobx";

interface ModalStateList {
    sources: {
        isOpen: boolean;
        fromCardId?: number;
    };
    facts: boolean;
}

type ModalType = 'sources' | 'facts';

export default class ModalStore {
    public modalsState: ModalStateList = {
        sources: {
            isOpen: false,
            fromCardId: undefined
        },
        facts: false,
    }

    public constructor() {
        makeAutoObservable(this);
    }

    public setModal = (modalName: ModalType, fromId?: number, opened?: boolean) => {
        this.modalsState = {
            ...this.modalsState,
            ...{
                [modalName]: {
                    isOpen: opened ?? !this.modalsState[modalName],
                    fromCardId: fromId,
                }
            }
        }
    }
}