import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TeamModal from './TeamModal.component';
import { act } from 'react-dom/test-utils';
import Position from '@/models/additional-content/teampositions.model';
import { message } from 'antd';
import 'jest-canvas-mock';
import Image, { ImageCreate } from '@/models/media/image.model';

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

global.URL.createObjectURL = jest.fn(() => 'test.jpg');

const store = {
    fetchTeamAll: jest.fn(),
    createTeam: jest.fn(),
    updateTeam: jest.fn(),
    deleteTeam: jest.fn(),
    getTeamArray: [
        {
            id: 1,
            isMain: true,
            name: 'name',
            description: 'description',
            imageId: -999,
            teamMemberLinks: [],
            positions: [],
        }
    ],
};
jest.mock('@stores/root-store', () => (() => ({ teamStore: store })));
jest.mock("@/app/common/components/FileUploader/FileUploader.component");
jest.mock('@/app/api/team/teampositions.api', () => ({
    getAll: async () => ({
        totalAmount: 2,
        positions: [
            {
                id: 1,
                position: 'pos1',
            },
            {
                id: 2,
                position: 'pos2',
            }] as Position[],
    }),
}));

jest.mock("@/app/api/media/images.api", () => ({
    create: (image: ImageCreate) => (
        Promise.resolve({
            id: 999,
            base64: image.baseFormat,
            blobName: image.title,
            mimeType: image.mimeType,
            alt: image.alt
        } as Image)
    ),
}));

const optionRenderSpy = jest.fn();
jest.mock('antd', () => {
    const antd = jest.requireActual('antd');
    const message = antd;

    const Select = ({ children, value, onSelect, onDeselect, onChange, options, ...otherProps }: any) => {
        return <select onChange={e => {
            onSelect?.(e.target.value);
            onChange?.();
        }} {...otherProps}>
            {options?.map((option: { value: string, label: string }) => {
                optionRenderSpy(option.label);
                return (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                )
            })}
            {children}
        </select>;
    };

    return {
        ...antd,
        Select,
        message: {
            ...message,
            loading: jest.fn(),
            success: jest.fn(),
            config: jest.fn(),
            error: jest.fn(),
        },
    };
});

describe('TeamModal', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('renders component', () => {
        act(() => {
            render(<TeamModal open={true} setIsModalOpen={() => { }} />);
        });
    });

    it('closes modal', async () => {
        const setIsModalOpen = jest.fn();
        act(() => {
            render(<TeamModal open={true} setIsModalOpen={setIsModalOpen} />);
        });

        const closeButton = screen.getByRole('button', { name: /Close/i });

        act(() => {
            userEvent.click(closeButton);
        });

        await waitFor(() => {
            expect(setIsModalOpen).toHaveBeenCalledWith(false);
        });
    });

    it('restricts text amount in inputs', async () => {
        act(() => {
            render(<TeamModal open={true} setIsModalOpen={() => { }} />);
        });

        const nameInput = screen.getByRole('textbox', { name: /Прізвище та ім'я:/i });
        const descriptionInput = screen.getByRole('textbox', { name: /Опис:/i });

        const str = 'test string 25 symbols ..'.repeat(6);

        act(() => {
            userEvent.type(nameInput, str);
            userEvent.type(descriptionInput, str);
        });

        await waitFor(() => {
            expect(nameInput).toHaveValue(str.slice(0, 41));
            expect(descriptionInput).toHaveValue(str.slice(0, 70));
        });
    });

    it('creates new team member with required fields', async () => {
        const afterSubmit = jest.fn();
        act(() => {
            render(<TeamModal open={true} setIsModalOpen={() => { }} afterSubmit={afterSubmit} />);
        });

        const nameInput = screen.getByRole('textbox', { name: /Прізвище та ім'я:/i });
        const photoInput = screen.getByTestId('fileuploader');
        const createButton = screen.getByRole('button', { name: /Зберегти/i });

        act(() => {
            userEvent.type(nameInput, 'Test Name');
            userEvent.upload(photoInput, new File(['(⌐□_□)'], 'test.jpg', { type: 'image/jpeg' }));
        });

        await waitFor(() => {
            expect(createButton).not.toBeDisabled();
        });

        act(() => {
            userEvent.click(createButton);
        });

        await waitFor(() => {
            expect(store.createTeam).toHaveBeenCalled();
            expect(message.success).toHaveBeenCalled();
            expect(afterSubmit).toHaveBeenCalled();
            expect(store.updateTeam).not.toHaveBeenCalled();
        });
    });

    it('edits team member', async () => {
        act(() => {
            render(<TeamModal open={true} setIsModalOpen={() => { }} teamMember={{
                id: 1,
                name: 'name',
                positions: [{ id: 1, position: 'pos1' }],
                description: 'Test Description',
                imageId: 1,
                image: {
                    id: 1,
                    base64: 'test',
                    blobName: 'test.jpg',
                    mimeType: 'image/jpeg',
                    alt: 'test',
                },
                teamMemberLinks: [{ id: 1, logoType: 1, targetUrl: 'x.com/test' }],
                isMain: true,
            }} />);
        });

        const checkbox = screen.getByRole('checkbox', { name: /Ключовий член команди/i });
        const descriptionInput = screen.getByRole('textbox', { name: /Опис:/i });
        const photoInput = screen.getByTestId('fileuploader');
        const createButton = screen.getByRole('button', { name: /Зберегти/i });

        act(() => {
            userEvent.click(checkbox);
            userEvent.type(descriptionInput, 'Test Description 2');
            userEvent.upload(photoInput, new File(['(⌐□_□)'], 'test2.jpg', { type: 'image/jpeg' }));
        });

        await waitFor(() => {
            expect(createButton).not.toBeDisabled();
        });

        act(() => {
            userEvent.click(createButton);
        });

        await waitFor(() => {
            expect(store.updateTeam).toHaveBeenCalled();
            expect(message.success).toHaveBeenCalled();
            expect(store.createTeam).not.toHaveBeenCalled();
        });
    });

    it('save button is diabled when all fields aren`t filled', async () => {
        act(() => {
            render(<TeamModal open={true} setIsModalOpen={() => { }} />);
        });

        const checkbox = screen.getByRole('checkbox', { name: /Ключовий член команди/i });
        const nameInput = screen.getByRole('textbox', { name: /Прізвище та ім'я:/i });
        const descriptionInput = screen.getByRole('textbox', { name: /Опис:/i });
        const createButton = screen.getByRole('button', { name: /Зберегти/i });

        act(() => {
            userEvent.click(checkbox);
            userEvent.type(nameInput, 'Test Name');
            userEvent.type(descriptionInput, 'Test Description');
        });

        await waitFor(() => {
            expect(createButton).toBeDisabled();
        });
    });

    it('creates new team member with all fields', async () => {
        const afterSubmit = jest.fn((a: any) => (console.log(JSON.stringify(a))));

        act(() => {
            render(<TeamModal open={true} setIsModalOpen={() => { }} afterSubmit={afterSubmit} />);
        });

        const checkbox = screen.getByRole('checkbox', { name: /Ключовий член команди/i });
        const nameInput = screen.getByRole('textbox', { name: /Прізвище та ім'я:/i });
        const positionInput = screen.getByRole('combobox', { name: /Позиції/i });
        const descriptionInput = screen.getByRole('textbox', { name: /Опис:/i });
        const photoInput = screen.getByTestId('fileuploader');
        const socialInput = screen.getByRole('combobox', { name: /Соціальна мережа/i });
        const linkInput = screen.getByRole('textbox', { name: /Посилання/i });
        const linkAddButton = screen.getByRole('button', { name: /plus/i });
        const createButton = screen.getByRole('button', { name: /Зберегти/i });

        await waitFor(() => {
            userEvent.selectOptions(positionInput, 'pos1');
            userEvent.click(checkbox);
            userEvent.type(nameInput, 'Test Name');
            userEvent.type(descriptionInput, 'Test Description');
            userEvent.upload(photoInput, new File(['(⌐□_□)'], 'test.jpg', { type: 'image/jpeg' }));
            userEvent.selectOptions(socialInput, 'Ваш сайт');
            userEvent.type(linkInput, 'https://x.com/test');
            userEvent.click(linkAddButton);
        });

        await waitFor(() => {
            expect(createButton).not.toBeDisabled();
        });

        act(() => {
            userEvent.click(createButton);
        });

        await waitFor(() => {
            expect(store.createTeam).toHaveBeenCalled();
            expect(message.success).toHaveBeenCalled();
            expect(afterSubmit).toHaveBeenCalled();
            expect(store.updateTeam).not.toHaveBeenCalled();
        });
    }, 30000);
});
