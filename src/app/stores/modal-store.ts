import { makeAutoObservable } from 'mobx';

type ModalState = {
    isOpen: boolean;
    fromCardId?: number;
};

const DefaultModalState: ModalState = {
    isOpen: false,
    fromCardId: undefined,
};

interface ModalList {
    sources: ModalState;
    facts: ModalState;
}

export default class ModalStore {
    public modalsState: ModalList = {
        sources: DefaultModalState,
        facts: DefaultModalState,
    };

    public constructor() {
        makeAutoObservable(this);
    }

    public setModal = (modalName: keyof ModalList, fromId?: number, opened?: boolean) => {
        this.modalsState[modalName] = {
            isOpen: opened ?? !this.modalsState[modalName].isOpen,
            fromCardId: fromId,
        };
    };
}
