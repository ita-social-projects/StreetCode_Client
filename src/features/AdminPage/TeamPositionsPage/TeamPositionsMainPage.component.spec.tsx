import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import TeamPositionsMainPage from '@features/AdminPage/TeamPositionsPage/TeamPositionsMainPage.component';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

jest.mock('mobx-react-lite', () => ({
    ...jest.requireActual('mobx-react-lite'), // if you want to keep some original functionality
    observer: jest.fn((Component) => Component), // mock observer as a pass-through
}));

export default function overrideMatchMedia() {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: () => ({
            matches: false,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => {}
        }),
    });
}

overrideMatchMedia();

describe('TeamPositionsMainPage', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const queryClient = new QueryClient();

    it('should render component without crashes', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TeamPositionsMainPage/>
            </QueryClientProvider>,
        );
        const column1 = screen.getByRole('columnheader', {name: /назва/i});
        const column2 = screen.getByRole('columnheader', {name: /дії/i});
        const button = screen.getByText(/додати нову позицію/i);
        expect(column1).toBeInTheDocument();
        expect(column2).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });

    it('opens the add modal on button click', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TeamPositionsMainPage/>
            </QueryClientProvider>,
        );
        const addButton = screen.getByText(/додати нову позицію/i);
        userEvent.click(addButton);
        const button = screen.getByText(/зберегти/i);
        const title = screen.getByRole('heading', { name: /додати позицію/i });
        const label = screen.getByText(/назва:/i);
        expect(button).toBeInTheDocument();
        expect(title).toBeInTheDocument();
        expect(label).toBeInTheDocument();
    });

    it('open edits position', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TeamPositionsMainPage/>
            </QueryClientProvider>,
        );
        const addButton = screen.getByText(/додати нову позицію/i);
        userEvent.click(addButton);
        const row = screen.getByRole('row', { name: /pos1/i });
        const button = within(row).getByRole('img', { name: /edit/i });
        userEvent.click(button);
        const title = screen.getByRole('heading', { name: /редагувати позицію/i });
        const characterAmout = screen.getByText(/4 \/ 50/i);
        expect(title).toBeInTheDocument();
        expect(characterAmout).toBeInTheDocument();

    });
});
