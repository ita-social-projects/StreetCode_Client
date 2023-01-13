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
    relatedFigures: ModalState;
    sources: ModalState;
    facts: ModalState;
    audio: ModalState;
}

export default class ModalStore {
    public modalsState: ModalList = {
        relatedFigures: DefaultModalState,
        sources: DefaultModalState,
        facts: DefaultModalState,
        audio: DefaultModalState,
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
