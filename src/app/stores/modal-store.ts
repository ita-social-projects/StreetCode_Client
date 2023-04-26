import { makeAutoObservable } from 'mobx';

type ModalState = {
    isOpen: boolean;
    fromCardId?: number;
    confirmationProps?:ConfirmationProps;
};
interface ConfirmationProps {
 onSubmit?:()=>void,
 onCancel?:()=>void,
 text?:string
}

const DefaultModalState: ModalState = {
    isOpen: false,
    fromCardId: undefined,
    confirmationProps: undefined,
};

interface ModalList {
    relatedFigures: ModalState;
    relatedFigureItem: ModalState;
    sources: ModalState;
    facts: ModalState;
    audio: ModalState;
    donates: ModalState;
    login: ModalState;
    artGallery: ModalState;
    partners: ModalState;
    tagsList: ModalState;
    addTerm: ModalState;
    editTerm: ModalState;
    deleteTerm: ModalState;
    deleteStreetcode: ModalState;
    confirmation: ModalState;
    adminFacts: ModalState;
    statistics: ModalState;
}

export default class ModalStore {
    public modalsState: ModalList = {
        relatedFigures: DefaultModalState,
        relatedFigureItem: DefaultModalState,
        sources: DefaultModalState,
        facts: DefaultModalState,
        audio: DefaultModalState,
        donates: DefaultModalState,
        login: DefaultModalState,
        artGallery: DefaultModalState,
        partners: DefaultModalState,
        tagsList: DefaultModalState,
        addTerm: DefaultModalState,
        editTerm: DefaultModalState,
        deleteTerm: DefaultModalState,
        deleteStreetcode: DefaultModalState,
        confirmation: DefaultModalState,
        adminFacts: DefaultModalState,
        statistics: DefaultModalState,
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

    public setConfirmationModal = (
        modalName: keyof ModalList,
        onSubmit?:()=>void,
        text?:string,
        opened?: boolean,
        onCancel?:()=>void,
    ) => {
        this.modalsState[modalName] = {
            isOpen: opened ?? !this.modalsState[modalName].isOpen,
            confirmationProps: { onSubmit, text, onCancel },
        };
    };
}
