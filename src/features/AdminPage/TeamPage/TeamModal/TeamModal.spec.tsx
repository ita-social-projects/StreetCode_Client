import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import '@testing-library/jest-dom';

import TeamModal from './TeamModal.component';

const mockSetIsModalOpen = jest.fn();

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

jest.mock('@/app/api/team/teampositions.api', () => ({
    getAll: jest.fn(() => Promise.resolve({ positions: [{ id: 1, position: 'Manager' }] })),
}));

describe('TeamModal', () => {
    it('should add link on add button click when input is valid', async () => {
        render(<TeamModal open setIsModalOpen={mockSetIsModalOpen} />);
        
        const form = screen.getByTestId('link-form');
        const logotypeInput = screen.getByTestId('logotype-select').firstElementChild;
        const urlInput = screen.getByTestId('link-input');
        const addButton = screen.getByTestId('add-button');

        fireEvent.mouseDown(logotypeInput!);
        const logotypeOption = screen.getByText('TikTok');
        fireEvent.click(logotypeOption);
        fireEvent.change(urlInput, { target: { value: 'https://tiktok.com/@user' } });
        fireEvent.submit(addButton);

        await waitFor(() => {
            const item = screen.getByTestId('team-source-list-0');
            expect(item).toBeInTheDocument();
        });
    });
});
