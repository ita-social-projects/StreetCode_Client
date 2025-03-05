import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import user from '@testing-library/user-event';
import 'jest-canvas-mock';
import { Form, message } from 'antd';
import NewTimelineModal from './NewTimelineModal.component';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { store, timelineExample } from '../../../../../../__mocks__/@stores/root-store';
import TimelineItem, { DateViewPattern, HistoricalContextUpdate } from '@/models/timeline/chronology.model';
import BUTTON_LABELS from "@constants/buttonLabels";

export default function overrideMatchMedia() {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: () => ({
            matches: false,
            onchange: null,
            addListener: () => { },
            removeListener: () => { },
            addEventListener: () => { },
            removeEventListener: () => { },
            dispatchEvent: () => { }
        }),
    });
}

overrideMatchMedia();

const mockTimeLine: TimelineItem = {
    id: 1,
    title: 'mockTitle',
    description: 'mockDescription',
    date: '2020-02-20T00:00:00.000Z',
    dateViewPattern: DateViewPattern.DateMonthYear,
    historicalContexts: [],
};

jest.mock('antd', () => {
    const antd = jest.requireActual('antd');
    const message = antd;

    const Select = ({ id, children, value, onSelect, onDeselect, onChange, options, onInputKeyDown, onSearch, ...otherProps }: any) => {
        const [selectedValue, setSelectedValue] = useState<string>(value || '');
        const form = Form.useFormInstance();
        const handleChange = async (e: any) => {
            await onSelect?.(e.target.value);
            await onChange?.(e.target.value);
            setSelectedValue(e.target.value);
        }
        return <div >
            <button aria-label={`${id}-deselect`} onClick={() => { onDeselect(selectedValue) }}>{selectedValue}</button>
            <input aria-label={`${id}-search`} type="search" onChange={async (e) => {
                await onInputKeyDown(e);
                await onSearch(e.target.value);
                await handleChange(e);
            }} />
            <select id={id} value={selectedValue} onChange={handleChange} {...otherProps}>
                {options?.map((option: { value: string, label: string }) => {
                    return (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    )
                })}
                {children}
            </select>
        </div>;
    };
    Select.Option = (props: any) => {
        return <option {...props} />
    }

    const DatePicker = ({ id, value, onChange, ...props }: any) => {
        const form = Form.useFormInstance();
        useEffect(() => {
            form.setFieldsValue({
                [id]: dayjs(),
            });
        }, []);
        return <input {...props} id={id} value={value || ''} onChange={(e) => onChange(dayjs(e.target.value))} type='date' role='textbox' />;
    }

    return {
        ...antd,
        Select,
        DatePicker,
        message: {
            ...message,
            success: jest.fn(),
            config: jest.fn(),
            error: jest.fn(),
        },
    };
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
const addContextItemMock = jest.fn();
jest.mock('@stores/root-store', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        timelineItemStore: {
            getTimelineItemArray: [],
            addTimeline: addTimelineMock,
            timelineItemMap: new Map<number, TimelineItem>(),
        },
        historicalContextStore: {
            addItemToArray: addContextItemMock,
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

describe('NewTimelineModal', () => {
    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });
    const defaultProps = {
        timelineItem: undefined,
        open: true,
        setIsModalOpen: jest.fn(),
        onChange: jest.fn(),
    };

    it('renders without errors', async () => {
        act(() => {
            render(<NewTimelineModal {...defaultProps} />);
        });
    });

    it('disables save button on start', async () => {
        act(() => {
            render(<NewTimelineModal {...defaultProps} />);
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: BUTTON_LABELS.SAVE })).toBeDisabled();
        });
    });

    it('should call setIsModalOpen on close', async () => {
        act(() => {
            render(<NewTimelineModal {...defaultProps} />);
        });

        const closeButton = screen.getByRole('button', { name: /Close/i });

        act(() => {
            userEvent.click(closeButton);
        });

        await waitFor(() => {
            expect(defaultProps.setIsModalOpen).toHaveBeenCalled();
        });
    });

    it('should create timeline with required fields only', async () => {
        act(() => {
            render(<NewTimelineModal
                open={open}
                setIsModalOpen={setOpen}
                onChange={onChangeMock}
            />);
        });
        const inputTitle = screen.getByTestId('input-title');
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

        const saveButton = screen.getByRole('button', { name: BUTTON_LABELS.SAVE });

        // Act
        await waitFor(() => {
            user.type(inputTitle, createTimelineWithRequiredOnly.title);
            fireEvent.change(screen.getByRole('combobox', { name: "" }), { target: { value: 'Рік, місяць' } });
            userEvent.type(screen.getByRole('textbox', { name: /Дата:/i }), '2024-08-08');
            user.type(textareaDescription, createTimelineWithRequiredOnly.description!);
            user.click(buttonSave);
        });

        // Assert
        await waitFor(() => {
            expect(message.error).not.toHaveBeenCalled();
            expect(message.success).toHaveBeenCalled();
            expect(saveButton).toBeDisabled();
            expect(onChangeMock).toHaveBeenCalled();
            expect(addTimelineMock).toHaveBeenCalledWith(createTimelineWithRequiredOnly);
        });
    });

    it('should add new historical context', async () => {
        act(() => {
            render(<NewTimelineModal {...defaultProps} />);
        });

        act(() => {
            fireEvent.change(screen.getByRole('searchbox',{name:"historicalContexts-search"}), { target: { value: 'newcontext' } });
        });

        await waitFor(() => {
            expect(addContextItemMock).toHaveBeenCalled();
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

        fireEvent.change(screen.getByRole('combobox', { name: "" }), { target: { value: 'Рік, день місяць' } });
        userEvent.type(screen.getByRole('textbox', { name: /Дата:/i }), '2024-08-08');

        fireEvent.change(screen.getByRole('combobox', { name: /Контекст:/i }), { target: { value: 'context 1' } });
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

        fireEvent.change(screen.getByRole('combobox', { name: /Контекст:/i }), { target: { value: 'context 2' } });
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
            userEvent.type(inputTitle, longText);

            // userEvent.type() takes too much time to input all the text, so fireEvent.change() partially
            // fills description and userEvent.type() tries to exceed text amount restrictions
            fireEvent.change(textareaDescription, { target: { value: veryLongText } });
            userEvent.type(textareaDescription, longText);
        });

        // Assert
        expect(inputTitle.getAttribute('value')).toHaveLength(titleRestriction);
        expect(textareaDescription.value.length).toBe(descriptionRestriction);
    });
});
