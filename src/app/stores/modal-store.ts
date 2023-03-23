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
    relatedFiguresItem: ModalState;
    sources: ModalState;
    facts: ModalState;
    audio: ModalState;
    donates: ModalState;
    login: ModalState;
    artGallery: ModalState;
    tagsList: ModalState;
}

export default class ModalStore {
    public modalsState: ModalList = {
        relatedFigures: DefaultModalState,
        relatedFiguresItem: DefaultModalState,
        sources: DefaultModalState,
        facts: DefaultModalState,
        audio: DefaultModalState,
        donates: DefaultModalState,
        login: DefaultModalState,
        artGallery: DefaultModalState,
        tagsList: DefaultModalState,
    };

    public isPageDimmed = false;

    public constructor() {
        makeAutoObservable(this);
    }

    public setIsPageDimmed = (dimmed?: boolean) => {
        this.isPageDimmed = dimmed ?? !this.isPageDimmed;
    };

    public setModal = (modalName: keyof ModalList, fromId?: number, opened?: boolean) => {
        this.modalsState[modalName] = {
            isOpen: opened ?? !this.modalsState[modalName].isOpen,
            fromCardId: fromId,
        };
    };
}
