import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContextMainPage from '@features/AdminPage/ContextPage/ContextMainPage.component';
import React from 'react';
import userEvent from '@testing-library/user-event';

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

describe('ContextMainPage', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should render component without crashes', () => {
        render(<ContextMainPage/>);
        const column1 = screen.getByRole('columnheader', {name: /назва/i});
        const column2 = screen.getByRole('columnheader', {name: /дії/i});
        const context1 = screen.getByText(/революція гідності/i);
        const context2 = screen.getByText(/студентство/i);
        const button = screen.getByText(/революція гідності/i);
        expect(column1).toBeInTheDocument();
        expect(column2).toBeInTheDocument();
        expect(context1).toBeInTheDocument();
        expect(context2).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });

    it('opens the add modal on button click', () => {
        render(<ContextMainPage/>);
        const addButton = screen.getByText(/додати новий контекст/i);
        userEvent.click(addButton);
        const button = screen.getByText(/зберегти/i);
        const title = screen.getByRole('heading', {name: /додати новий контекст/i});
        const label = screen.getByText(/назва:/i);
        expect(button).toBeInTheDocument();
        expect(title).toBeInTheDocument();
        expect(label).toBeInTheDocument();
    });

    it('open edits context', () => {
        render(<ContextMainPage />);
        const addButton = screen.getByText(/додати новий контекст/i);
        userEvent.click(addButton);
        const row = screen.getByRole('row', { name: /революція гідності/i });
        const button = within(row).getByRole('img', { name: /edit/i });
        userEvent.click(button);
        const title = screen.getByRole('heading', { name: /редагувати контекст/i });
        const characterAmout = screen.getByText(/18 \/ 50/i);
        expect(title).toBeInTheDocument();
        expect(characterAmout).toBeInTheDocument();
    });
});
