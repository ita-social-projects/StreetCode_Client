import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import 'jest-canvas-mock';
import { Form, message } from 'antd';
import NewTimelineModal from './NewTimelineModal.component';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { store, timelineExample } from '../../../../../../__mocks__/@stores/root-store';

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
        return <input id={id} value={value || ''} onChange={(e) => onChange(dayjs(e.target.value))} type='date' role='textbox' />;
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

describe('NewTimelineModal', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    afterEach(() => {
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
            expect(screen.getByRole('button', { name: /Зберегти/i })).toBeDisabled();
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

    it('should not create new timeline if title is empty', async () => {
        act(() => {
            render(<NewTimelineModal {...defaultProps} />);
        });

        const saveButton = screen.getByRole('button', { name: /Зберегти/i });

        act(() => {
            userEvent.type(screen.getByRole('textbox', { name: /Опис:/i }), 'Test description');
        });

        await waitFor(() => {
            expect(saveButton).not.toBeDisabled();
        });

        act(() => {
            userEvent.click(saveButton);
        });

        await waitFor(() => {
            expect(message.error).toHaveBeenCalled();
            expect(message.success).not.toHaveBeenCalled();
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
            expect(store.historicalContextStore.addItemToArray).toHaveBeenCalled();
        });
    });

    it('should create new timeline', async () => {
        act(() => {
            render(<NewTimelineModal {...defaultProps} />);
        });
        const saveButton = screen.getByRole('button', { name: /Зберегти/i });

        act(() => {
            fireEvent.change(screen.getByRole('combobox', { name: /Контекст:/i }), { target: { value: 'context1' } });
            fireEvent.change(screen.getByRole('combobox', { name: "" }), { target: { value: 'Рік, місяць' } });
            userEvent.type(screen.getByRole('textbox', { name: /Дата:/i }), '2021-01-01');
            userEvent.type(screen.getByRole('textbox', { name: /Назва:/i }), 'Test title 2');
            userEvent.type(screen.getByRole('textbox', { name: /Опис:/i }), 'Test description 2');
        });

        await waitFor(() => {
            expect(saveButton).not.toBeDisabled();
        });

        act(() => {
            userEvent.click(saveButton);
        });

        await waitFor(() => {
            expect(store.timelineItemStore.addTimeline).toHaveBeenCalled();
            expect(message.success).toHaveBeenCalled();
            expect(message.error).not.toHaveBeenCalled();
        });
    });

    it('should edit timeline', async () => {
        act(() => {
            render(<NewTimelineModal {...defaultProps} timelineItem={timelineExample} />);
        });
        const saveButton = screen.getByRole('button', { name: /Зберегти/i });

        act(() => {
            userEvent.type(screen.getByRole('combobox', { name: /Контекст:/i }), 'Test context 2');
            userEvent.type(screen.getByRole('textbox', { name: /Дата:/i }), '2021-01-01');
            userEvent.type(screen.getByRole('textbox', { name: /Опис:/i }), 'Test description 2');
        });

        await waitFor(() => {
            expect(saveButton).not.toBeDisabled();
        });

        act(() => {
            userEvent.click(saveButton);
        });

        await waitFor(() => {
            expect(message.success).toHaveBeenCalled();
            expect(store.timelineItemStore.addTimeline).not.toHaveBeenCalled();
            expect(message.error).not.toHaveBeenCalled();
        });
    });
});
