/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable no-restricted-imports */
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import BUTTON_LABELS from '@constants/buttonLabels';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import { MockPagination, MockPaginationProps } from '../../../../__mocks__/antd/antd';

import Newss from './News.component';

const getPaginationInfoMpckFn = () => {
    const mockFn = jest.fn();
    mockFn.mockReturnValue({
        PageSize: 1,
        TotalPages: 1,
        TotalItems: 1,
        CurrentPage: 1,
    });
    return mockFn;
};

jest.mock('@stores/root-store', () => ({
    __esModule: true,
    default: () => ({
        newsStore: {
            getAll: jest.fn().mockResolvedValue([]),
            NewsMap: new Map(),
            getNewsArray: [],
            deleteNews: jest.fn(),
            setInternalMap: jest.fn(),
            PaginationInfo: getPaginationInfoMpckFn(),
            setQueryClient: jest.fn(),
        },
        imagesStore: {
            fetchImages: jest.fn(),
        },
    }),
    useModalContext: jest.fn(() => ({
        modalStore: {
            setConfirmationModal: jest.fn(),
        },
    })),
}));

jest.mock('antd', () => {
    const antd = jest.requireActual('antd');

    const Pagination = ({ current, total, pageSize, onChange }: MockPaginationProps) => (
        <MockPagination
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={onChange}
        />
    );

    const Button = ({ onClick, className, children }: {
      onClick: (React.MouseEventHandler<HTMLAnchorElement> & React.MouseEventHandler<HTMLButtonElement>) | undefined;
      className: string;
      children: ReactNode;
    }) => (
        <button type="button" onClick={onClick} className={className}>{children}</button>
    );

    return {
        ...antd,
        Pagination,
        Button,
    };
});

jest.mock('antd/es/table', () => ({ columns }: any) => {
    const mockNewsData = [
        {
            id: '1',
            title: 'Mock News 1',
            image: {
                base64: 'mockBase64String',
                mimeType: 'image/png',
                alt: 'Mock News 1 Image',
            },
            creationDate: '2022-01-01',
            action: 'Mock Action',
        },
    ];
    return (
        <table>
            <thead>
                <tr>
                    {columns.map((column: any) => (
                        <th key={column.key}>{column.title}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {mockNewsData.map((news: any) => (
                    <tr key={news.id}>
                        {columns.map((column: any) => (
                            <td key={`${news.id}-${column.key}`}>
                                {column.dataIndex === 'image' ? (
                                    <img
                                        className="partners-table-logo"
                                        src={`data:${news.image.mimeType};base64,${news.image.base64}`}
                                        alt={news.image.alt}
                                    />
                                ) : column.render ? (
                                    column.render(news[column.dataIndex], news, 0)
                                ) : (
                                    news[column.dataIndex]
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
});

describe('News', () => {
    const queryClient = new QueryClient();
    it.skip('should render component and its elements', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <Newss />
                </MemoryRouter>
            </QueryClientProvider>,
        );

        const columnHeaders = screen.getAllByRole('columnheader');
        const createNewsButton = screen.getByText(BUTTON_LABELS.ADD_NEWS);

        const titleCell = screen.getByText('Mock News 1').closest('td');
        const imageCell = screen.getByAltText('Mock News 1 Image');
        const creationDateCell = screen.getByText('2022-01-01').closest('td');

        expect(createNewsButton).toBeInTheDocument();
        expect(columnHeaders).toHaveLength(4);
        expect(titleCell).toBeInTheDocument();
        expect(imageCell).toBeInTheDocument();
        expect(creationDateCell).toBeInTheDocument();
    });
});
