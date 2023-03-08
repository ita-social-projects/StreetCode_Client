import { makeAutoObservable } from 'mobx';

import { Term } from '@/models/streetcode/text-contents.model';

type ModalState = {
    isOpen: boolean;
    fromCardId?: number;
};

type TermModalState = {
    isOpen: boolean;
    bufferTerm?: Term;
};

const DefaultModalState: ModalState = {
    isOpen: false,
    fromCardId: undefined,
};

const DefaultTermState: TermModalState = {
    isOpen: false,
    bufferTerm: undefined,
};

interface ModalList {
    relatedFigures: ModalState;
    sources: ModalState;
    facts: ModalState;
    audio: ModalState;
    donates: ModalState;
    login: ModalState;
    artGallery: ModalState;
    addTerm: TermModalState;
    editTerm: TermModalState;
    deleteTerm: TermModalState;
}

export default class ModalStore {
    public modalsState: ModalList = {
        relatedFigures: DefaultModalState,
        sources: DefaultModalState,
        facts: DefaultModalState,
        audio: DefaultModalState,
        donates: DefaultModalState,
        login: DefaultModalState,
        artGallery: DefaultModalState,
        addTerm: DefaultTermState,
        editTerm: DefaultTermState,
        deleteTerm: DefaultTermState,
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

    public setTermModal = (modalName: keyof ModalList, term?: Term, opened?: boolean) => {
        this.modalsState[modalName] = {
            isOpen: opened ?? !this.modalsState[modalName].isOpen,
            bufferTerm: term,
        };
    };
}
