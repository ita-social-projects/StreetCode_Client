import {
    act, cleanup, fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import user from '@testing-library/user-event';

import TimelineItem, { DateViewPattern, HistoricalContextUpdate } from '@/models/timeline/chronology.model';

import '@testing-library/jest-dom';

import NewTimelineModal from './NewTimelineModal.component';

const mockTimeLine: TimelineItem = {
    id: 1,
    title: 'mockTitle',
    description: 'mockDescription',
    date: '2020-02-20T00:00:00.000Z',
    dateViewPattern: DateViewPattern.DateMonthYear,
    historicalContexts: [],
};

// needed to render component without errors
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: any) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => { },
    }),
});

jest.mock('@/app/common/components/Editor/QEditor.component', () => ({
    __esModule: true,
    default: jest.fn((props) => {
        const { value, onChange, maxChars } = props;
        const valueToSet = value ?? '';
        const handleOnChange = (newValue: string) => {
            onChange(newValue.slice(0, 3000));
        };
        return (
            <div>
                <input
                    type="text"
                    value={valueToSet}
                    onChange={(e) => handleOnChange(e.target.value)}
                    maxLength={maxChars}
                />
            </div>
        );
    }),
}));

const addTimelineMock = jest.fn();
jest.mock('@stores/root-store', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        timelineItemStore: {
            getTimelineItemArray: [],
            addTimeline: addTimelineMock,
            timelineItemMap: new Map<number, TimelineItem>(),
        },
        historicalContextStore: {
            historicalContextArray: [
                { id: 1, title: 'context 1' },
                { id: 2, title: 'context 2' },
            ],
            fetchHistoricalContextAll: jest.fn(),
        },
    })),
}));

const open = true;
const setOpen = () => { };
const onChangeMock = jest.fn();

describe('NewTimelineModal test', () => {
    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it('should be rendered', async () => {
        render(
            <NewTimelineModal
                open={open}
                setIsModalOpen={setOpen}
                onChange={onChangeMock}
            />,
        );

        const inputTitle = screen.getByTestId('input-title');
        const selectDate = screen.getByTestId('select-date');
        const datePicker = screen.getByTestId('date-picker');
        const selectContext = screen.getByTestId('select-context');
        const textareaDescription = screen.getByTestId('textarea-description');
        const buttonSave = screen.getByTestId('button-save');

        await waitFor(() => {
            expect(inputTitle).toBeInTheDocument();
            expect(selectDate).toBeInTheDocument();
            expect(datePicker).toBeInTheDocument();
            expect(selectContext).toBeInTheDocument();
            expect(textareaDescription).toBeInTheDocument();
            expect(buttonSave).toBeInTheDocument();
        });
    });

    it('should create timeline with required fields only', async () => {
        render(
            <NewTimelineModal
                open={open}
                setIsModalOpen={setOpen}
                onChange={onChangeMock}
            />,
        );

        // Arrange
        const inputTitle = screen.getByTestId('input-title');
        const datePicker = screen.getByTestId('date-picker');
        const textareaDescription = screen.getByTestId('textarea-description');
        const buttonSave = screen.getByTestId('button-save');

        const createTimelineWithRequiredOnly: TimelineItem = {
            id: -1,
            title: 'title',
            description: 'description',
            date: '2024-08-08T00:00:00.000Z',
            dateViewPattern: DateViewPattern.DateMonthYear,
            historicalContexts: [],
        };

        // Act & Assert
        user.type(inputTitle, createTimelineWithRequiredOnly.title);
        await waitFor(() => {
            expect(onChangeMock).toHaveBeenLastCalledWith('title', createTimelineWithRequiredOnly.title);
        });

        fireEvent.mouseDown(datePicker);
        fireEvent.change(datePicker, { target: { value: '2024, 8 August' } });
        fireEvent.click(document.querySelectorAll('.ant-picker-cell-selected')[0]);

        user.type(textareaDescription, createTimelineWithRequiredOnly.description!);
        await waitFor(() => {
            expect(onChangeMock).toHaveBeenLastCalledWith('description', createTimelineWithRequiredOnly.description);
        });

        user.click(buttonSave);
        await waitFor(() => {
            expect(addTimelineMock).toHaveBeenCalledWith(createTimelineWithRequiredOnly);
        });
    });

    it('should create timeline with all fields', async () => {
        render(
            <NewTimelineModal
                open={open}
                setIsModalOpen={setOpen}
                onChange={onChangeMock}
            />,
        );

        // Arrange
        const inputTitle = screen.getByTestId('input-title');
        const selectDate = screen.getByTestId('select-date');
        const datePicker = screen.getByTestId('date-picker');
        // If try to get by testId test doesn't work. Don't know why :(
        // const selectContext = screen.getByTestId('select-context');
        const selectContext = screen.getByRole('combobox', {
            name: /Контекст/i,
        });
        const textareaDescription = screen.getByTestId('textarea-description');
        const buttonSave = screen.getByTestId('button-save');

        const context: HistoricalContextUpdate = { id: 1, title: 'context 1', modelState: 0 };
        const createJobWithAllFields: TimelineItem = {
            id: -1,
            title: 'title',
            description: 'description',
            date: '2024-08-08T00:00:00.000Z',
            dateViewPattern: DateViewPattern.DateMonthYear,
            historicalContexts: [context],
        };

        // Act & Assert
        user.type(inputTitle, createJobWithAllFields.title);
        await waitFor(() => {
            expect(onChangeMock).toHaveBeenLastCalledWith('title', createJobWithAllFields.title);
        });

        user.click(selectDate);
        user.click(screen.getByTitle('Рік, день місяць')!);

        user.click(datePicker);
        fireEvent.change(datePicker, { target: { value: '2024, 8 August' } });
        user.click(document.querySelectorAll('.ant-picker-cell-selected')[0]);

        user.click(selectContext);
        user.click(screen.getByTitle('context 1'));
        expect(onChangeMock).toHaveBeenLastCalledWith('historicalContexts', createJobWithAllFields.historicalContexts);

        user.type(textareaDescription, createJobWithAllFields.description!);
        await waitFor(() => {
            expect(onChangeMock).toHaveBeenLastCalledWith('description', createJobWithAllFields.description);
        });

        user.click(buttonSave);
        await waitFor(() => {
            expect(addTimelineMock).toHaveBeenCalledWith(createJobWithAllFields);
        });
    });

    // TODO: consider adding check for editiong the date type and date itself
    it('should edit timeline data', async () => {
        render(
            <NewTimelineModal
                timelineItem={mockTimeLine}
                open={open}
                setIsModalOpen={setOpen}
                onChange={onChangeMock}
            />,
        );

        const inputTitle = screen.getByTestId('input-title');
        const selectContext = screen.getByRole('combobox', {
            name: /Контекст/i,
        });
        const textareaDescription = screen.getByTestId('textarea-description');
        const buttonSave = screen.getByTestId('button-save');

        const editedTimeLine = {
            title: 'edited title',
            description: 'edited description',
            historicalContexts: [{ id: 2, modelState: 0, title: 'context 2' }],
        };

        user.clear(inputTitle);
        user.clear(textareaDescription);

        user.type(inputTitle, editedTimeLine.title);
        await waitFor(() => {
            expect(onChangeMock).toHaveBeenLastCalledWith('title', editedTimeLine.title);
        });

        user.type(textareaDescription, editedTimeLine.description);
        await waitFor(() => {
            expect(onChangeMock).toHaveBeenLastCalledWith('description', editedTimeLine.description);
        });

        user.click(selectContext);
        user.click(screen.getByTitle('context 2'));
        expect(onChangeMock).toHaveBeenLastCalledWith('historicalContexts', editedTimeLine.historicalContexts);

        await act(async () => {
            user.click(buttonSave);
        });
    });

    it('should check text amount restrictions', async () => {
        render(
            <NewTimelineModal
                open={open}
                setIsModalOpen={setOpen}
                onChange={onChangeMock}
            />,
        );

        // Arrange
        const inputTitle = screen.getByTestId('input-title');
        const textareaDescription = screen.getByTestId('textarea-description') as HTMLTextAreaElement;

        const titleRestriction = 26;
        const descriptionRestriction = 400;
        const text = 'String which excides text amount limit';
        const longText = text;
        const veryLongText = text.repeat(11);

        // Act
        await waitFor(() => {
            user.type(inputTitle, longText);

            // user.type() takes too much time to input all the text, so fireEvent.change() partially
            // fills description and user.type() tries to exceed text amount restrictions
            fireEvent.change(textareaDescription, { target: { value: veryLongText } });
            user.type(textareaDescription, longText);
        });

        // Assert
        expect(inputTitle.getAttribute('value')).toHaveLength(titleRestriction);
        expect(textareaDescription.value.length).toBe(descriptionRestriction);
    });
});
