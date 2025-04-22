import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContextMainPage from '@features/AdminPage/ContextPage/ContextMainPage.component';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BUTTON_LABELS from '@constants/buttonLabels';
import { act } from '@testing-library/react';

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
    ...jest.requireActual('mobx-react-lite'),
    observer: jest.fn((Component) => Component),
}));

jest.mock('@stores/root-store', () => ({
    __esModule: true,
    useModalContext: jest.fn(() => ({
        modalStore: {
            setConfirmationModal: jest.fn(),
        },
    })),
    useMobx: jest.fn(() => ({
        contextStore: {
            setCurrentPage: jest.fn(),
            fetchContexts: jest.fn(),
            deleteContext: jest.fn(),
            getContextArray: [],
            PaginationInfo: {
                CurrentPage: 1,
                PageSize: 10,
                TotalItems: 0,
            },
        },
    })),
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

describe('ContextMainPage', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const queryClient = new QueryClient();
    const mockModalStore = {
        setConfirmationModal: jest.fn(),
    };

    it.skip('should render component without crashes', async () => {
        await act(async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <ContextMainPage />
                </QueryClientProvider>,
            );
        });

        const column1 = screen.getByRole('columnheader', { name: /назва/i });
        const column2 = screen.getByRole('columnheader', { name: /дії/i });

        expect(column1).toBeInTheDocument();
        expect(column2).toBeInTheDocument();
    });

    it.skip('opens the add modal on button click', async () => {
        await act(async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <ContextMainPage/>
                </QueryClientProvider>,
            );
        });

        const addButton = screen.getByText(BUTTON_LABELS.ADD_CONTEXT);
        await userEvent.click(addButton); 

        const button = screen.getByText(BUTTON_LABELS.SAVE);
        const label = screen.getByText(/назва:/i);
        const title = screen.getByRole('heading', { name: /додати контекст/i });

        expect(button).toBeInTheDocument();
        expect(title).toBeInTheDocument();
        expect(label).toBeInTheDocument();
    });

    it.skip('open edits context', async () => {
        await act(async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <ContextMainPage/>
                </QueryClientProvider>,
            );
        });

        const row = screen.getByRole('row', { name: /Революція гідності/i });
        const editButton = within(row).getByRole('button', { name: /edit/i });

        await userEvent.click(editButton);

        const title = screen.getByRole('heading', { name: /редагувати контекст/i });
        const characterAmount = screen.getByText(/18 \/ 50/i);

        expect(title).toBeInTheDocument();
        expect(characterAmount).toBeInTheDocument();
    });
});