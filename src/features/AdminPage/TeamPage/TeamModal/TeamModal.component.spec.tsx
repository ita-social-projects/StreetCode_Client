import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TeamModal from './TeamModal.component';

jest.mock('@/app/api/team/positions.api', () => ({
    getAll: jest.fn(() => Promise.resolve([{ position: 'Developer' }])),
}));

jest.mock('antd', () => {
    const originalModule = jest.requireActual('antd');
    return {
        ...originalModule,
        Form: {
            ...originalModule.Form,
            useForm: jest.fn(() => [{}, {}]),
        },
        Modal: jest.fn(({ onCancel }) => (
            <div>
                <div data-testid="modal-close" onClick={onCancel} />
                <div data-testid="modal-content" />
            </div>
        )),
        message: {
            config: jest.fn(),
        }
    };
});

jest.mock('@features/AdminPage/NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component', () => ({
    __esModule: true,
    default: () => <div data-testid="mockPreviewModal">Mock Preview Modal</div>,
}));

const mockTeamMember = {
    id: 1,
    isMain: false,
    imageId: 0,
    teamMemberLinks: [],
    name: 'Jane Doe',
    positions: [{ id: 1, position: 'Designer' }],
    description: 'Some description',
};

const setIsModalOpen = jest.fn();

describe('TeamModal Component', () => {
    const mockAfterSubmit = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a team member with required fields', async () => {
        render(<TeamModal open setIsModalOpen={setIsModalOpen} afterSubmit={mockAfterSubmit} />);

        // Fill in required fields
        userEvent.type(screen.getByLabelText(/Прізвище та ім'я/i), 'John Doe');

        // Click the submit button
        userEvent.click(screen.getByText(/Зберегти/i));

        // Wait for the API call to finish
        await waitFor(() => expect(mockAfterSubmit).toHaveBeenCalledWith(expect.any(Object)));

        // Assert that the afterSubmit function is called with the correct data
        expect(mockAfterSubmit).toHaveBeenCalledWith({
            id: 0,
            isMain: false,
            imageId: 0,
            teamMemberLinks: [],
            name: 'John Doe',
            positions: [{ id: expect.any(Number), position: 'Developer' }],
            description: '',
        });
    });

    it('should create a team member with all possible fields', async () => {
        render(<TeamModal open setIsModalOpen={setIsModalOpen} afterSubmit={mockAfterSubmit} />);

        // Fill in all fields
        userEvent.type(screen.getByLabelText(/Прізвище та ім'я/i), 'John Doe');
        userEvent.type(screen.getByLabelText(/Позиції/i), 'Developer');
        userEvent.type(screen.getByLabelText(/Опис/i), 'Lorem ipsum');
        // Add social media link
        userEvent.selectOptions(screen.getByLabelText(/Соціальна мережа/i), 'LinkedIn');
        userEvent.type(screen.getByLabelText(/URL/i), 'https://www.linkedin.com/in/johndoe');

        // Click the submit button
        userEvent.click(screen.getByText(/Зберегти/i));

        // Wait for the API call to finish
        await waitFor(() => expect(mockAfterSubmit).toHaveBeenCalledWith(expect.any(Object)));

        // Assert that the afterSubmit function is called with the correct data
        expect(mockAfterSubmit).toHaveBeenCalledWith({
            id: 0,
            isMain: false,
            imageId: 0,
            teamMemberLinks: [
                {
                    id: 0,
                    logoType: 4, // Assuming LinkedIn has the index 4 in your SOCIAL_OPTIONS
                    targetUrl: 'https://www.linkedin.com/in/johndoe',
                },
            ],
            name: 'John Doe',
            positions: [{ id: expect.any(Number), position: 'Developer' }],
            description: 'Lorem ipsum',
        });
    });

    it('should edit a team member', async () => {
        const originalTeamMember = {
            id: 1,
            isMain: false,
            imageId: 0,
            teamMemberLinks: [],
            name: 'Jane Doe',
            positions: [{ id: 1, position: 'Designer' }],
            description: 'Some description',
        };

        render(
            <TeamModal
                open
                setIsModalOpen={setIsModalOpen}
                afterSubmit={mockAfterSubmit}
                teamMember={originalTeamMember}
            />,
        );

        // Change the name and position
        userEvent.clear(screen.getByLabelText(/Прізвище та ім'я/i));
        userEvent.type(screen.getByLabelText(/Прізвище та ім'я/i), 'Edited Jane Doe');
        userEvent.clear(screen.getByLabelText(/Позиції/i));
        userEvent.type(screen.getByLabelText(/Позиції/i), 'Lead Designer');

        // Click the submit button
        userEvent.click(screen.getByText(/Зберегти/i));

        // Wait for the API call to finish
        await waitFor(() => expect(mockAfterSubmit).toHaveBeenCalledWith(expect.any(Object)));

        // Assert that the afterSubmit function is called with the correct data
        expect(mockAfterSubmit).toHaveBeenCalledWith({
            id: 1,
            isMain: false,
            imageId: 0,
            teamMemberLinks: [],
            name: 'Edited Jane Doe',
            positions: [{ id: 1, position: 'Lead Designer' }],
            description: 'Some description',
        });
    });

    it('should close the modal when clicking the close icon', async () => {
        render(
            <TeamModal
                open
                setIsModalOpen={setIsModalOpen}
                afterSubmit={mockAfterSubmit}
                teamMember={mockTeamMember}
            />,
        );

        // Click the close icon
        userEvent.click(screen.getByTestId('modal-close'));

        // Assert that setIsModalOpen is called with false
        expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });

    it('renders mock preview modal', () => {
        render(
            <TeamModal
                open
                setIsModalOpen={setIsModalOpen}
                afterSubmit={mockAfterSubmit}
                teamMember={mockTeamMember}
            />,
        );

        expect(screen.getByTestId('mockPreviewModal')).toBeInTheDocument();
    });
});
