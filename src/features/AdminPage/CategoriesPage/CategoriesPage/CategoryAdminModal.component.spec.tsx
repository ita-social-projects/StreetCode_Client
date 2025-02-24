import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import React, { useState } from 'react';
import CategoryAdminModal from './CategoryAdminModal.component';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import SourcesApi from '@/app/api/sources/sources.api';
import 'jest-canvas-mock';
import { message } from 'antd';
import { UploadFile } from 'antd/es/upload';
import Image from '@/models/media/image.model';
import Uploader from '../../../../app/common/components/FileUploader/FileUploader.component';
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

global.URL.createObjectURL = jest.fn();
jest.mock('@app/api/sources/sources.api', () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
        update: jest.fn(),
    },
}));

const mockImage = {
    id: 1,
    base64: "base64",
    blobName: "blobName",
    mimeType: "image/jpeg"
} as Image;

jest.mock("@/app/common/components/FileUploader/FileUploader.component");

jest.mock("@/app/api/media/images.api", () => ({
    create: () => (
        Promise.resolve(mockImage)
    ),
    getById: (id: number) => (
        Promise.resolve({
            id: 1,
            base64: "base64",
            blobName: "blobName",
            mimeType: "image/jpeg"
        } as Image)
    ),
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
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
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
            render(<CategoryAdminModal {...defaultProps} setIsModalOpen={setIsModalOpen} />);
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
            expect(screen.getByRole('button', { name: BUTTON_LABELS.SAVE })).toBeDisabled();
        });
    });

    it('should create new category', async () => {
        const isNewCategory = jest.fn();
        act(() => {
            render(<CategoryAdminModal {...defaultProps} isNewCategory={isNewCategory} />);
        });

        const saveButton = screen.getByRole('button', { name: BUTTON_LABELS.SAVE });
        const uploader = screen.getByTestId('fileuploader');

        await waitFor(() => {
            userEvent.type(screen.getByRole('textbox', { name: /Назва/i }), 'New category');
            userEvent.upload(uploader, new File(['(⌐□_□)'], 'new-image.jpg', { type: 'image/jpg' }));
        });

        await waitFor(() => userEvent.click(saveButton));

        await waitFor(() => {
            expect(SourcesApi.create).toHaveBeenCalled();
            expect(isNewCategory).toHaveBeenCalledWith(true);
            expect(message.success).toHaveBeenCalled();
        });
    });

    it('should disable save button after creating', async () => {
        const isNewCategory = jest.fn();
        act(() => {
            render(<CategoryAdminModal {...defaultProps} isNewCategory={isNewCategory} />);
        });

        const saveButton = screen.getByRole('button', { name: BUTTON_LABELS.SAVE });
        const uploader = screen.getByTestId('fileuploader');

        await waitFor(() => {
            userEvent.type(screen.getByRole('textbox', { name: /Назва/i }), 'New category');
            userEvent.upload(uploader, new File(['(⌐□_□)'], 'new-image.jpg', { type: 'image/jpg' }));
        });

        await waitFor(() => {
            expect(saveButton).not.toBeDisabled();
        });

        await waitFor(() => userEvent.click(saveButton));

        await waitFor(() => {
            expect(saveButton).toBeDisabled();
        }, { timeout: 3000 });
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
        const nameInput = screen.getByRole('textbox', { name: /Назва/i });
        const saveButton = screen.getByRole('button', { name: BUTTON_LABELS.SAVE });
        const fileuploader = screen.getByTestId('fileuploader');

        await waitFor(() => {
            userEvent.clear(nameInput);
            userEvent.type(nameInput, 'New category');
            userEvent.upload(fileuploader, new File(['(⌐□_□)'], 'new-image.jpg', { type: 'image/jpg' }));
        });

        await waitFor(() => {
            expect(saveButton).not.toBeDisabled();
        });
        await waitFor(() => userEvent.click(saveButton));

        await waitFor(() => {
            expect(SourcesApi.update).toHaveBeenCalled();
            expect(SourcesApi.create).not.toHaveBeenCalled();
            expect(message.success).toHaveBeenCalled();
        });
    });

    it('should disable save button after updating', async () => {
        const initialData = {
            id: 1,
            title: 'Category',
            imageId: 1,
        };
        act(() => {
            render(<CategoryAdminModal {...defaultProps} initialData={initialData} />);
        });

        const nameInput = screen.getByRole('textbox', { name: /Назва/i });
        const saveButton = screen.getByRole('button', { name: BUTTON_LABELS.SAVE });
        const fileuploader = screen.getByTestId('fileuploader');

        await waitFor(() => {
            userEvent.clear(nameInput);
            userEvent.type(nameInput, 'New category');
            userEvent.upload(fileuploader, new File(['(⌐□_□)'], 'new-image.jpg', { type: 'image/jpg' }));
        });

        await waitFor(() => {
            expect(saveButton).not.toBeDisabled();
        });

        await waitFor(() => userEvent.click(saveButton));

        await waitFor(() => {
            expect(saveButton).toBeDisabled();
        }, { timeout: 3000 });
    });

    it('should show error message when title is empty', async () => {
        act(() => {
            render(<CategoryAdminModal {...defaultProps} />);
        });

        const saveButton = screen.getByRole('button', { name: BUTTON_LABELS.SAVE });

        act(() => {
            userEvent.type(screen.getByRole('textbox', { name: /Назва/i }), '  ');
            userEvent.upload(screen.getByTestId('fileuploader'), new File(['(⌐□_□)'], 'new-image.jpg', { type: 'image/jpg' }));
        });

        await waitFor(() => {
            expect(saveButton).not.toBeDisabled();
        });

        await waitFor(() => userEvent.click(saveButton));

        await waitFor(() => {
            expect(message.error).toHaveBeenCalled();
        });
    });
});
