import Context, { ContextCreate } from '@models/additional-content/context.model';
import ContextsApi from '@api/additional-content/contexts.api';
import TeampositionsApi from '@api/team/teampositions.api';
import Position from '@models/additional-content/teampositions.model';
import { SourceCategoryAdmin, StreetcodeCategoryContent } from '@/models/sources/sources.model';
import sourcesApi from '@/app/api/sources/sources.api';
import TimelineItem, { HistoricalContext } from '@/models/timeline/chronology.model';

export const timelineExample = {
    id: 1,
    date: '2021-01-01',
    dateViewPattern: 0,
    title: 'Test title',
    description: 'Test description',
    historicalContexts: [{ id: 1, title: 'Test context' }]
} as TimelineItem;

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

export const useAudioContext = () => ({
    audio: {
        base64: 'base64Mock',
        mimeType: 'audio/mpeg',
    },
});

export const store = ({
    newsStore: {
        updateNews: mockUpdateNews,
        createNews: mockCreateNews,
        NewsArray: [
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
        PaginationInfo: {
            PageSize: 10,
            TotalPages: 1,
            TotalItems: 1,
            CurrentPage: 1,
        },
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
        PaginationInfo: {
            PageSize: 10,
            TotalPages: 1,
            TotalItems: 1,
            CurrentPage: 1,
        },
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
    sourcesAdminStore: {
        setSource: jest.fn(),
        setInternalSourceCategories: jest.fn(),
        getSourcesAdmin: [],
        fetchSourceCategories: jest.fn(),
        deleteSourceCategory: jest.fn(async (srcId: number) => {
            await sourcesApi.delete(srcId);
        }),
        addSourceCategory: jest.fn(async (sourceItem: SourceCategoryAdmin) => {
            await sourcesApi.create(sourceItem);
        }),
        updateSourceCategory: jest.fn(async (sourceItem: SourceCategoryAdmin) => {
            await sourcesApi.update(sourceItem);
        }),
    },
    sourceCreateUpdateStreetcode: {
        streetcodeCategoryContents: [],
        indexUpdate: -1,
        ElementToUpdate: {} as StreetcodeCategoryContent,
        addSourceCategoryContent: jest.fn(),
        setItem: jest.fn(),
        updateElement: jest.fn(),
        removeSourceCategoryContent: jest.fn(),
        getCategoryContentsArrayToUpdate: [],
    },
    timelineItemStore: {
        timelineItemMap: new Map<number, TimelineItem>([[1, timelineExample]]),
        addTimeline: jest.fn(),
        deleteTimelineFromMap: jest.fn(),
        setActiveYear: jest.fn(),
        getTimelineItemArray: [timelineExample],
        getTimelineItemArrayToCreate: [],
        getTimelineItemArrayToUpdate: [],
        getYearsArray: [],
        fetchTimelineItemsByStreetcodeId: jest.fn(),
        createTimelineItem: jest.fn(),
        updateTimelineItem: jest.fn(),
        deleteTimelineItem: jest.fn(),
    },
    historicalContextStore: {
        historicalContextArray: [{ id: 1, title: "context1" }, { id: 2, title: "context2" }] as HistoricalContext[],
        addItemToArray: jest.fn(),
        fetchHistoricalContextAll: jest.fn(),
    },
});
export const useMobx = () => (store)
export default useMobx;
