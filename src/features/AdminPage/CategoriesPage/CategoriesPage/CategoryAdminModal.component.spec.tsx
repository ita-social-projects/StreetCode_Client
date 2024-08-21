import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import CategoryAdminModal from './CategoryAdminModal.component';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import SourcesApi from '@/app/api/sources/sources.api';
import 'jest-canvas-mock';
import { message } from 'antd';
import Image from '@/models/media/image.model';

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

global.URL.createObjectURL = jest.fn();

jest.mock('@app/api/sources/sources.api', () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
        update: jest.fn(),
    },
}));

jest.mock('@api/media/images.api', () => ({
    __esModule: true,
    default: {
        getById: async () => ({
            id: 1,
            base64: "base64",
            blobName: "blobName",
            mimeType: "image/jpeg"
        } as Image),
    },
}));

jest.mock('antd', () => {
    const antd = jest.requireActual('antd');
    const message = antd;

    return {
        ...antd,
        message: {
            ...message,
            success: jest.fn(),
            config: jest.fn(),
            error: jest.fn(),
        },
    };
});

describe('CategoryAdminModal', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    afterEach(() => {
        cleanup();
    });
    const defaultProps = {
        isModalVisible: true,
        setIsModalOpen: jest.fn(),
        isNewCategory: jest.fn(),
        initialData: undefined,
    };

    it('renders without errors', async () => {
        act(() => {
            render(<CategoryAdminModal {...defaultProps} />);
        });
    });

    it('calls setIsModalOpen with false when the cancel button is clicked', async () => {
        const setIsModalOpen = jest.fn();
        act(() => {
            render(<CategoryAdminModal {...defaultProps} isModalVisible={true} setIsModalOpen={setIsModalOpen} />);
        });

        act(() => {
            fireEvent.click(screen.getByRole('button', { name: /Close/i }));
        });

        await waitFor(() => {
            expect(setIsModalOpen).toHaveBeenCalledWith(false);
        });
    });

    it('should disable the save button on start', async () => {
        act(() => {
            render(<CategoryAdminModal {...defaultProps} />);
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Зберегти/i })).toBeDisabled();
        });
    });

    it('should create new category', async () => {
        const isNewCategory = jest.fn();
        act(() => {
            render(<CategoryAdminModal {...defaultProps} isNewCategory={isNewCategory} />);
        });

        const saveButton = screen.getByRole('button', { name: /Зберегти/i });

        act(() => {
            userEvent.type(screen.getByRole('textbox', { name: /Назва/i }), 'New category');
            userEvent.upload(screen.getByTestId('fileuploader'), new File(['(⌐□_□)'], 'new-image.jpg', { type: 'image/jpg' }));
        });
        await waitFor(() => {
            expect(saveButton).not.toBeDisabled();
        });

        act(() => {
            userEvent.click(saveButton);
        });

        await waitFor(() => {
            expect(message.success).toHaveBeenCalled();
            expect(SourcesApi.create).toHaveBeenCalled();
            expect(isNewCategory).toHaveBeenCalledWith(true);
            expect(SourcesApi.update).not.toHaveBeenCalled();
            expect(saveButton).toBeDisabled();
        });
    });

    it('should update existing category', async () => {
        const initialData = {
            id: 1,
            title: 'Category',
            imageId: 1,
        };
        act(() => {
            render(<CategoryAdminModal {...defaultProps} initialData={initialData} />);
        });

        const saveButton = screen.getByRole('button', { name: /Зберегти/i });

        act(() => {
            userEvent.type(screen.getByRole('textbox', { name: /Назва/i }), 'New category');
            userEvent.upload(screen.getByTestId('fileuploader'), new File(['(⌐□_□)'], 'new-image.jpg', { type: 'image/jpg' }));
        });
        await waitFor(() => {
            expect(saveButton).not.toBeDisabled();
        });

        act(() => {
            userEvent.click(saveButton);
        });

        await waitFor(() => {
            expect(message.success).toHaveBeenCalled();
            expect(SourcesApi.update).toHaveBeenCalled();
            expect(SourcesApi.create).not.toHaveBeenCalled();
            expect(saveButton).toBeDisabled();
        });
    });

    it('should show error message when title is empty', async () => {
        act(() => {
            render(<CategoryAdminModal {...defaultProps} />);
        });

        const saveButton = screen.getByRole('button', { name: /Зберегти/i });

        act(() => {
            userEvent.type(screen.getByRole('textbox', { name: /Назва/i }), '   ');
            userEvent.upload(screen.getByTestId('fileuploader'), new File(['(⌐□_□)'], 'new-image.jpg', { type: 'image/jpg' }));
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
});