import Context, {ContextCreate} from "@models/additional-content/context.model";
import ContextsApi from "@api/additional-content/contexts.api";

export const mockID = 1;
export const mockIsOpen = true;
export const mockSetModal = jest.fn();
export const mockUpdateNews = jest.fn();
export const mockCreateNews = jest.fn();

export const mockUseModalContext = jest.fn();

export const useModalContext = () => ({
    modalStore: {
        setModal: mockSetModal,
        modalsState: {
            deleteStreetcode: {
                isOpen: mockIsOpen,
                fromCardId: mockID,
            },
        },
        useModalContext: mockUseModalContext,
        setConfirmationModal: jest.fn((modalName : any, onSubmit: () => void) => {}),
    },
});

export const useMobx = () => ({
    newsStore: {
        updateNews: mockUpdateNews,
        createNews: mockCreateNews,
        getNewsArray: [
            {
                id: 1,
                title: 'title',
                text: 'text',
                url: 'url',
                creationDate: '2024-01-29',
            },
        ],
    },
    contextStore: {
        fetchContexts: jest.fn(),
        createContext: (context: ContextCreate) => {
            ContextsApi.create(context);
        },
        updateContext: (context: Context) => {
            ContextsApi.update(context);
        },
        deleteContext: (id: number) => {
            ContextsApi.delete(id);
        },
        getContextArray: [
            {
                id: 1,
                title: 'Революція гідності',
            },
            {
                id: 2,
                title: 'Студентство',
            },
        ],
    },
});

export default useMobx;
