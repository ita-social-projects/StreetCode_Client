import React from 'react';
import { act } from 'react-dom/test-utils';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import StreetcodesApi from '@/app/api/streetcode/streetcodes.api';

import './matchMedia';

import NewStreetcode from './MainNewStreetcode.component';

const router = createMemoryRouter([{ path: '*', element: <NewStreetcode /> }]);
const mockData = {
    id: 1,
    title: 'Mock Title',
    index: 456,
    transliterationUrl: 'http://localhost/mock-url',
    firstName: 'Jane',
    lastName: 'Doe',
    teaser: 'Mock teaser',
};

jest.mock('axios', () => ({
    create: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ data: { data: 'mocked data' } })),
        defaults: {
            headers: {
                common: {},
            },
        },
        interceptors: {
            request: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() },
            response: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() },
        },
    })),
}));

jest.mock('@/app/api/streetcode/streetcodes.api', () => ({
    getById: jest.fn((_) => Promise.resolve(mockData)),
    create: jest.fn().mockResolvedValue([]),
    getAllPublished: jest.fn().mockResolvedValue([]),
}));
jest.mock('@/app/api/additional-content/tags.api', () => ({
    getAll: jest.fn().mockResolvedValue([
        { id: 1, title: 'Tag1' },
        { id: 2, title: 'Tag2' },
    ]),
}));
jest.mock('@/app/api/sources/sources.api', () => ({
    getAllCategories: jest.fn().mockResolvedValue([
        { id: 1, title: 'Category 1' },
        { id: 2, title: 'Category 2' },
    ]),
    getAllNames: jest.fn().mockResolvedValue([
        { id: 1, title: 'Name 1' },
        { id: 2, title: 'Name 2' },
    ]),
}));

jest.mock('@stores/root-store', () => ({
    __esModule: true,
    default: () => ({
        factsStore: {
            getFactArray: jest.fn().mockResolvedValue([
                { id: '1', title: 'Fact 1', factContent: 'Fact 1 content', imageId: 1 },
                { id: '2', title: 'Fact 2', factContent: 'Fact 2 content', imageId: 2 },
            ]),
            updateFactMapWithNewOrder: jest.fn(),
        },
        partnersStore: {
            PartnerMap: [],
            fetchPartnersAll: jest.fn(),
            setInternalMap: jest.fn(),
        },
        sourceCreateUpdateStreetcode: {
            streetcodeCategoryContents: [],
        },
        artStore: {
            arts: [],
        },
        sourcesAdminStore: {
            setInternalSourceCategories: jest.fn(),
        },
        historicalContextStore: {
            fetchHistoricalContextAll: jest.fn(),
            historicalContextArray: [],
        },
        streetcodeArtSlideStore: {
            getArtSlidesAsDTO: jest.fn(),
            streetcodeArtSlides: [],
            getVisibleSortedSlides: jest.fn().mockResolvedValue([]),
        },
        artGalleryTemplateStore: {
            streetcodeArtSlides: [{ index: 1 }],
        },
    }),
    useStreetcodeDataContext: jest.fn(() => ({
        streetcodeStore: {
            itChangedIdChange: jest.fn(),
        },
    })),
}));

jest.mock('@features/AdminPage/NewStreetcode/PartnerBlock/PartnerBlockAdmin.component', () => ({
    ...jest.requireActual('@features/AdminPage/NewStreetcode/PartnerBlock/PartnerBlockAdmin.component'),
    alphabeticalSorting: jest.fn((partnersItems) => partnersItems.slice().sort((a, b) => a.title.localeCompare(b.title))),
}));

jest.mock('./PartnerBlock/PartnerBlockAdmin.component', () => {
    const { Select, Button } = jest.requireActual('antd');
    return () => (
        <div>
            <Select data-testid="partnersCombobox">
                ...
            </Select>
            <Button
                name="addPartnerBtn"
            >
                Додати
            </Button>
        </div>
    );
});
jest.mock('./InterestingFactsBlock/InterestingFactsBlock.component', () => () => <button name="factBtn" type="button">+</button>);

describe('NewStreetcode Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    const renderComponent = async () => {
        await act(async () => {
            render(<RouterProvider router={router} />);
        });
    };

    const findRequiredFields = async () => {
        await renderComponent();

        const streetcodeNumberInput = screen.getByRole('spinbutton', { name: 'streetcodeNumber' });
        const mainTitleInput = screen.getByRole('textbox', { name: 'mainTitle' });
        const streetcodeUrlNameInput = screen.getByRole('textbox', { name: 'streetcodeUrlName' });
        const dateStringInput = screen.getByRole('textbox', { name: 'dateString' });
        const firstDatePickerInput = screen.getByRole('textbox', { name: 'streetcodeFirstDate' });
        const teaserInput = screen.getByRole('textbox', { name: 'teaser' });

        return { streetcodeNumberInput, mainTitleInput, streetcodeUrlNameInput, dateStringInput, firstDatePickerInput, teaserInput };
    };

    const typeInitialDataForReqFields = async () => {
        const {
            streetcodeNumberInput, mainTitleInput, streetcodeUrlNameInput, dateStringInput, firstDatePickerInput, teaserInput,
        } = await findRequiredFields();

        await act(async () => {
            userEvent.type(streetcodeNumberInput, '123');
            userEvent.type(mainTitleInput, 'Test Title');
            userEvent.type(streetcodeUrlNameInput, 'test-url');
            userEvent.type(dateStringInput, 'Test Date');
            userEvent.type(firstDatePickerInput, '2020-02-20T00:00:00.000Z');
            userEvent.type(teaserInput, 'Test Teaser');
        });

        return { streetcodeNumberInput, mainTitleInput, streetcodeUrlNameInput, dateStringInput, firstDatePickerInput, teaserInput };
    };

    const mockFile = (name : string, sizeInMb : number, type : string) => {
        const content = new Uint8Array(sizeInMb * 1024 * 1024);
        return new File([content], name, { type });
    };

    it('for creation with only all required fields', async () => {
        const {
            streetcodeNumberInput, mainTitleInput, streetcodeUrlNameInput, dateStringInput, firstDatePickerInput, teaserInput,
        } = await typeInitialDataForReqFields();

        await act(async () => {
            expect(streetcodeNumberInput).toBeInTheDocument();
            expect(mainTitleInput).toBeInTheDocument();
            expect(streetcodeUrlNameInput).toBeInTheDocument();
            expect(dateStringInput).toBeInTheDocument();
            expect(firstDatePickerInput).toBeInTheDocument();
            expect(teaserInput).toBeInTheDocument();
        });
    });

    it('for creation with all possible fields and entities', async () => {
        const {
            streetcodeNumberInput, mainTitleInput, streetcodeUrlNameInput, dateStringInput, firstDatePickerInput, teaserInput,
        } = await findRequiredFields();

        const personEventSwitchInput = screen.getByRole('checkbox', { name: 'personEventSwitch' });
        const nameInput = screen.getByRole('textbox', { name: 'name' });
        const surnameInput = screen.getByRole('textbox', { name: 'surname' });
        const aliasInput = screen.getByRole('textbox', { name: 'alias' });
        const firstDateTypeInput = screen.getByTestId('firstDateType');
        const secondDateTypeInput = screen.getByTestId('secondDateType');
        const secondDatePickerInput = screen.getByRole('textbox', { name: 'streetcodeSecondDate' });
        const tagsInput = screen.getByTestId('tagsCombobox');
        const resolutionTooltip = screen.getByRole('tooltip', { name: 'resolution' });
        const animationsButton = screen.getByRole('button', { name: 'animations' });
        const pictureBlackWhiteButton = screen.getByRole('button', { name: 'pictureBlackWhite' });
        const pictureRelationsButton = screen.getByRole('button', { name: 'pictureRelations' });
        const audioButton = screen.getByRole('button', { name: 'audio' });
        const titleInput = screen.getByRole('textbox', { name: 'title' });
        const textContentInput = screen.getByRole('textbox', { name: 'textContent' });
        const previousTextViewButton = screen.getByRole('button', { name: 'previousTextViewBtn' });
        const additionalTextInput = screen.getByRole('textbox', { name: 'additionalText' });
        const videoInput = screen.getByRole('textbox', { name: 'video' });
        const previousVideoViewButton = screen.getByRole('button', { name: 'video' });
        const factButton = screen.getByRole('button', { name: 'factBtn' });
        const timelineButton = screen.getByRole('button', { name: 'TimelineBtn' });
        const downloadArtButton = screen.getByRole('button', { name: 'downloadArt' });
        const artGallery = screen.getByTestId('artGallery');
        const relatedFigures = screen.getByTestId('relatedFigures');
        const forFansButton = screen.getByRole('button', { name: 'forFansBtn' });
        const partnersInput = screen.getByTestId('partnersCombobox');
        const addPartnerButton = screen.getByRole('button', { name: 'addPartnerBtn' });
        const subtitleInput = screen.getByRole('textbox', { name: 'subtitle' });
        const arlinkInput = screen.getByRole('textbox', { name: 'arlink' });

        expect(streetcodeNumberInput).toBeInTheDocument();
        expect(personEventSwitchInput).toBeInTheDocument();
        expect(mainTitleInput).toBeInTheDocument();
        expect(nameInput).toBeInTheDocument();
        expect(surnameInput).toBeInTheDocument();
        expect(aliasInput).toBeInTheDocument();
        expect(streetcodeUrlNameInput).toBeInTheDocument();
        expect(dateStringInput).toBeInTheDocument();
        expect(firstDateTypeInput).toBeInTheDocument();
        expect(firstDatePickerInput).toBeInTheDocument();
        expect(secondDateTypeInput).toBeInTheDocument();
        expect(secondDatePickerInput).toBeInTheDocument();
        expect(tagsInput).toBeInTheDocument();
        expect(resolutionTooltip).toBeInTheDocument();
        expect(teaserInput).toBeInTheDocument();
        expect(animationsButton).toBeInTheDocument();
        expect(pictureBlackWhiteButton).toBeInTheDocument();
        expect(pictureRelationsButton).toBeInTheDocument();
        expect(audioButton).toBeInTheDocument();
        expect(titleInput).toBeInTheDocument();
        expect(textContentInput).toBeInTheDocument();
        expect(previousTextViewButton).toBeInTheDocument();
        expect(additionalTextInput).toBeInTheDocument();
        expect(videoInput).toBeInTheDocument();
        expect(previousVideoViewButton).toBeInTheDocument();
        expect(factButton).toBeInTheDocument();
        expect(timelineButton).toBeInTheDocument();
        expect(downloadArtButton).toBeInTheDocument();
        expect(artGallery).toBeInTheDocument();
        expect(relatedFigures).toBeInTheDocument();
        expect(forFansButton).toBeInTheDocument();
        expect(partnersInput).toBeInTheDocument();
        expect(addPartnerButton).toBeInTheDocument();
        expect(subtitleInput).toBeInTheDocument();
        expect(arlinkInput).toBeInTheDocument();
    });

    it('loads small and large images and audio from project assets', async () => {
        await typeInitialDataForReqFields();

        const animationsButton = screen.getByRole('button', { name: 'animations' });
        const audioButton = screen.getByRole('button', { name: 'audio' });
        const saveButton = screen.getByTestId('publishBtn');

        const smallImage = mockFile('small-image.webp', 0.1, 'image/webp'); // 100 KB
        const largeImage = mockFile('large-image.webp', 5, 'image/webp'); // 5 MB
        const audioFile = mockFile('audio.mp3', 10, 'audio/mpeg'); // 10 MB

        await act(async () => {
            userEvent.upload(animationsButton, [smallImage, largeImage]);
            userEvent.upload(audioButton, [audioFile]);
            userEvent.click(saveButton);
        });

        await waitFor(() => {
            expect(StreetcodesApi.create).toHaveBeenCalledWith(expect.objectContaining({
                images: expect.arrayContaining([
                    expect.objectContaining({ name: 'small-image.webp', size: 0.1 * 1024 * 1024 }),
                    expect.objectContaining({ name: 'large-image.webp', size: 5 * 1024 * 1024 }),
                ]),
                audio: expect.objectContaining({ name: 'audio.mp3', size: 10 * 1024 * 1024 }),
            }));
        });
    });

    it('checks if correct entity was sent to backend', async () => {
        await typeInitialDataForReqFields();

        const saveButton = screen.getByTestId('publishBtn');

        await act(async () => {
            userEvent.click(saveButton);
        });

        await waitFor(() => {
            expect(StreetcodesApi.create).toHaveBeenCalledWith(expect.objectContaining({
                index: 123,
                title: 'Test Title',
                transliterationUrl: 'test-url',
                dateString: 'Test Date',
                eventStartOrPersonBirthDate: '2020-02-20T00:00:00.000Z',
                teaser: 'Test Teaser',
            }));
        });
    });

    it('checks if all data that was accepted from mocked get request was set in corresponding fields', async () => {
        await StreetcodesApi.getById(1);

        await renderComponent();

        await waitFor(() => {
            expect(screen.getByDisplayValue('Mock Title')).toBeInTheDocument();
            expect(screen.getByDisplayValue('456')).toBeInTheDocument();
            expect(screen.getByDisplayValue('http://localhost/mock-url')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Jane')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Mock teaser')).toBeInTheDocument();
        });
    });
});
