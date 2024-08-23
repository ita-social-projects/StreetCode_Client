import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import CategoriesModal from './CategoriesAdminModal.component';
import { SourceCategory, SourceCategoryName } from '@/models/sources/sources.model';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { Form, message } from 'antd';
import { store } from '../../../../../../__mocks__/@stores/root-store';
import { useEffect, useState } from 'react';

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

    const Select = ({ id, children, value, onSelect, onDeselect, onChange, options, ...otherProps }: any) => {
        const [selectedValue, setSelectedValue] = useState<string>(null!);
        const form = Form.useFormInstance();
        useEffect(() => {
            console.log('setting value', selectedValue);
            form.setFieldsValue({ [id]: selectedValue });
        }, [selectedValue]);
        return <div >
            <button aria-label={selectedValue} onClick={() => { onDeselect(selectedValue) }}>{selectedValue}</button>
            <select id={id} value={selectedValue || value} onChange={async e => {
                await onSelect?.(e.target.value);
                await onChange?.(e.target.value);
                setSelectedValue(e.target.value);
            }} {...otherProps}>
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

    return {
        ...antd,
        Select,
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
    default: ({ onChange, value, maxChars, onCharacterCountChange, ...props }: any) => {
        const handleOnChange = (newValue: string) => {
            onChange(newValue);
            onCharacterCountChange(newValue.length);
        };
        return (
            <div>
                <textarea
                    data-testid="mockEditor"
                    value={value}
                    onChange={(e) => handleOnChange(e.target.value)}
                    maxLength={maxChars}
                />
            </div>
        );
    },
}));

const openAddCategoryModalSpy = jest.fn();
jest.mock('@/features/AdminPage/CategoriesPage/CategoriesPage/CategoryAdminModal.component', () => {
    return {
        __esModule: true,
        default: ({ isModalVisible, isNewCategory, setIsModalOpen }: any) => {
            useEffect(() => {
                if (isModalVisible) {
                    openAddCategoryModalSpy();
                    isNewCategory?.(true);
                    setIsModalOpen?.(false);
                }
            }, [isModalVisible]);
            return <div>CategoryAdminModal</div>
        }
    }
});

jest.mock('@app/api/sources/sources.api', () => ({
    __esModule: true,
    default: {
        getAllCategories: async () => [{ id: 1, title: "first", imageId: 1, streetcodeId: 1 }, { id: 2, title: "second", imageId: 1, streetcodeId: 1 }] as SourceCategory[],
        getAllNames: async () => [{ id: 1, title: "first" }, { id: 2, title: "second" }] as SourceCategoryName[],
    },
}));

describe('CategoriesAdminModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    const defaultProps = {
        open: true,
        setOpen: jest.fn(),
        allCategories: [{ id: 1, title: "first" }, { id: 2, title: "second" }] as SourceCategoryName[],
        onChange: jest.fn(),
        allPersistedSourcesAreSet: true,
    };

    it('renders the modal without errors', () => {
        render(<CategoriesModal {...defaultProps} />);
    });

    it('should disable save button before input', () => {
        render(<CategoriesModal {...defaultProps} />);

        expect(screen.getByRole('button', { name: 'Зберегти' })).toBeDisabled();
    });

    it('should close the modal', async () => {
        render(<CategoriesModal {...defaultProps} />);

        const closeButton = screen.getByRole('button', { name: 'Close' });

        act(() => {
            userEvent.click(closeButton);
        });

        await waitFor(() => {
            expect(defaultProps.setOpen).toHaveBeenCalledWith(false);
        });
    });

    it('should open the add category modal', async () => {
        render(<CategoriesModal {...defaultProps} />);

        act(() => {
            fireEvent.change(screen.getByRole('combobox'), { target: { value: "addCategory" } });
        });

        await waitFor(() => {
            expect(openAddCategoryModalSpy).toHaveBeenCalled();
        });
    });

    it('should limit the input length', async () => {
        const character_limit = 100;
        render(<CategoriesModal {...defaultProps} character_limit={character_limit} />);

        const saveButton = screen.getByRole('button', { name: 'Зберегти' });

        act(() => {
            fireEvent.change(screen.getByRole('combobox'), { target: { value: "first" } });
            fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a'.repeat(character_limit * 2) } });
        });

        await waitFor(() => {
            expect(saveButton).not.toBeDisabled();
        });

        act(() => {
            userEvent.click(saveButton);
        });

        await waitFor(() => {
            expect(message.error).toHaveBeenCalled();
        });
    });
    it('should reject empty input', async () => {
        render(<CategoriesModal {...defaultProps} />);

        const saveButton = screen.getByRole('button', { name: 'Зберегти' });

        act(() => {
            fireEvent.change(screen.getByRole('combobox'), { target: { value: "first" } });
        });

        await waitFor(() => {
            expect(saveButton).not.toBeDisabled();
        });

        act(() => {
            userEvent.click(saveButton);
        });

        await waitFor(() => {
            expect(message.error).toHaveBeenCalled();
        });
    });

    it('should create new category', async () => {
        render(<CategoriesModal {...defaultProps} />);

        const saveButton = screen.getByRole('button', { name: 'Зберегти' });

        act(() => {
            fireEvent.change(screen.getByRole('combobox'), { target: { value: "1" } });
            userEvent.type(screen.getByRole('textbox'), 'new category');
        });

        await waitFor(() => {
            expect(saveButton).not.toBeDisabled();
        });

        act(() => {
            userEvent.click(saveButton);
        });

        await waitFor(() => {
            expect(store.sourceCreateUpdateStreetcode.addSourceCategoryContent).toHaveBeenCalled();
        });
    });
});