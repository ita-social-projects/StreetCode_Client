import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import Context from '@models/additional-content/context.model';
import ContextsApi from '@api/additional-content/contexts.api';
import ContextAdminModalComponent from '@features/AdminPage/ContextPage/ContextModal/ContextAdminModal.component';
import { message } from 'antd';
import overrideMatchMedia from '@features/AdminPage/ContextPage/ContextMainPage.component.spec';

overrideMatchMedia();

jest.mock('@/app/api/additional-content/contexts.api', () => ({
    create: jest.fn(() => {
    }),
    update: jest.fn(() => {
    }),
    delete: jest.fn(() => {
    }),
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

describe('ContextAdminModal', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('rendering component', () => {
        render(<ContextAdminModalComponent isModalVisible={true} setIsModalOpen={() => {
        }}/>);
        cleanup();
    });

    test('check text amount restrictions in inputs', async () => {
        render(<ContextAdminModalComponent isModalVisible={true} setIsModalOpen={() => {
        }}/>);

        const nameInput = screen.getByRole('textbox', {name: /назва:/i});

        const str = 'test string 25 symbols ..';

        act(() => {
            userEvent.type(nameInput, str.repeat(6));
        });

        await waitFor(() => {
            expect(nameInput).toHaveValue(str.repeat(2));
        });

        cleanup();
    });

    test('create new context', async () => {
        render(<ContextAdminModalComponent isModalVisible={true} setIsModalOpen={() => {
        }}/>);

        const nameInput = screen.getByRole('textbox', {name: /назва:/i});
        const button = screen.getByRole('button', {name: /зберегти/i});

        act(() => {
            userEvent.type(nameInput, 'New Context');
            userEvent.click(button);
        });

        await waitFor(() => {
            expect(ContextsApi.create).toHaveBeenCalled();
            expect(message.success).toHaveBeenCalled();
            expect(ContextsApi.update).not.toHaveBeenCalled();
        });

        cleanup();
    });

    test('update context', async () => {
        render(<ContextAdminModalComponent isModalVisible={true} setIsModalOpen={() => {
        }} initialData={{id: 1, title: 'Old Context'} as Context}/>);

        const nameInput = screen.getByRole('textbox', {name: /назва:/i});
        const button = screen.getByRole('button', {name: /зберегти/i});

        await waitFor(() => {
            expect(nameInput).toHaveValue('Old Context');
        });

        act(() => {
            userEvent.type(nameInput, 'New Context');
            userEvent.click(button);
        });

        await waitFor(() => {
            expect(ContextsApi.update).toHaveBeenCalled();
            expect(message.success).toHaveBeenCalled();
            expect(ContextsApi.create).not.toHaveBeenCalled();
        });

        cleanup();
    });

    test('throw error on validation', async () => {
        render(<ContextAdminModalComponent isModalVisible={true} setIsModalOpen={() => {
        }}/>);

        const nameInput = screen.getByRole('textbox', {name: /назва:/i}) as HTMLInputElement;
        const button = screen.getByRole('button', {name: /зберегти/i});

        nameInput.value = '';

        act(() => {
            userEvent.click(button);
        });

        await waitFor(() => {
            expect(message.error).toHaveBeenCalled();
        });

        cleanup();
    });
});
