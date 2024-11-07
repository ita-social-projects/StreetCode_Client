import Context, {ContextCreate} from '@models/additional-content/context.model';
import ContextsApi from '@api/additional-content/contexts.api';
import TeampositionsApi from '@api/additional-content/teampositions.api';
import Position from '@models/additional-content/teampositions.model';

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
    artGalleryTemplateStore: {
        streetcodeArtSlides: [],
        isEdited: false,
        isRedact: false,
        currentTemplateIndexRedact: -1,
        setArtInSlide: jest.fn(),
        removeArtInSlide: jest.fn(),
    },
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
    teamPositionsStore: {
        fetchPositions: jest.fn(),
        createPosition: (position: Position) => {
            TeampositionsApi.create(position);
        },
        updatePosition: (position: Position) => {
            TeampositionsApi.update(position);
        },
        deletePosition: (id: number) => {
            TeampositionsApi.delete(id);
        },
        getPositionsArray: [
            {
                id: 1,
                position: 'pos1',
            },
            {
                id: 2,
                position: 'pos 2',
            },
        ],
    },
});

export default useMobx;
