import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';

import { message } from 'antd';
import overrideMatchMedia from '@features/AdminPage/TeamPositionsPage/TeamPositionsMainPage.component.spec';
import TeamPositionsAdminModalComponent from '@features/AdminPage/TeamPositionsPage/TeamPositionsModal/TeamPositionsAdminModal.component';
import TeampositionsApi from '@api/team/teampositions.api';
import Position from '@models/additional-content/teampositions.model';
import BUTTON_LABELS from "@constants/buttonLabels";

overrideMatchMedia();

jest.mock('@/app/api/team/teampositions.api', () => ({
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

describe('TeamPositionsAdminModal', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('rendering component', () => {
        render(<TeamPositionsAdminModalComponent isModalVisible={true} setIsModalOpen={() => {
        }}/>);
        cleanup();
    });

    test('check text amount restrictions in inputs', async () => {
        render(<TeamPositionsAdminModalComponent isModalVisible={true} setIsModalOpen={() => {
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

    test('create new position', async () => {
        render(<TeamPositionsAdminModalComponent isModalVisible={true} setIsModalOpen={() => {
        }}/>);

        const nameInput = screen.getByRole('textbox', { name: /назва:/i });
        const button = screen.getByRole('button', { name: BUTTON_LABELS.SAVE });

        act(() => {
            userEvent.type(nameInput, 'New Position');
            userEvent.click(button);
        });

        await waitFor(() => {
            expect(TeampositionsApi.create).toHaveBeenCalled();
            expect(message.success).toHaveBeenCalled();
            expect(TeampositionsApi.update).not.toHaveBeenCalled();
        });

        cleanup();
    });

    test('update position', async () => {
        render(<TeamPositionsAdminModalComponent isModalVisible={true} setIsModalOpen={() => {
        }} initialData={{id: 1, position: 'Old Position'} as Position}/>);

        const nameInput = screen.getByRole('textbox', { name: /назва:/i });
        const button = screen.getByRole('button', { name: BUTTON_LABELS.SAVE });

        await waitFor(() => {
            expect(nameInput).toHaveValue('Old Position');
        });

        act(() => {
            userEvent.type(nameInput, 'New Position');
            userEvent.click(button);
        });

        await waitFor(() => {
            expect(TeampositionsApi.update).toHaveBeenCalled();
            expect(message.success).toHaveBeenCalled();
            expect(TeampositionsApi.create).not.toHaveBeenCalled();
        });

        cleanup();
    });

    test('throw error on validation', async () => {
        render(<TeamPositionsAdminModalComponent isModalVisible={true} setIsModalOpen={() => {
        }}/>);

        const nameInput = screen.getByRole('textbox', { name: /назва:/i }) as HTMLInputElement;
        const button = screen.getByRole('button', { name: BUTTON_LABELS.SAVE });

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
