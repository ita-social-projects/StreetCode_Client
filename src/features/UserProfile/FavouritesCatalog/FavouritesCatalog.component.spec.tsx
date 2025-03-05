import React from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import useMobx from '@stores/root-store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';

import { StreetcodeType } from '@/models/streetcode/streetcode-types.model';

import '@testing-library/jest-dom';

import FavouritesCatalog from './FavouritesCatalog.component';

jest.mock('@stores/root-store', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('FavouritesCatalog', () => {
    const mockFavouritesArray = [
        {
            id: 1,
            title: 'mock person',
            type: StreetcodeType.Person,
            imageId: 1,
        },
        {
            id: 2,
            title: 'mock event',
            type: StreetcodeType.Event,
            imageId: 2,
        },
    ];

    let mockStore: any;
    beforeEach(() => {
        mockStore = {
            imagesStore: {
                getImage: jest.fn(() => 'mockImage.png'),
            },
            favouritesCatalogStore: {
                getFavouritesArray: mockFavouritesArray,
            },
        };
        (useMobx as jest.Mock).mockReturnValue(mockStore);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const queryClient = new QueryClient();
    it('should render the FavouritesCatalog with the correct initial filter (All)', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <FavouritesCatalog />
                </MemoryRouter>
            </QueryClientProvider>,
        );

        expect(screen.getByRole('menuitem', { name: /Усі/i })).toHaveClass('ant-menu-item ant-menu-item-selected');
        expect(screen.getByText('mock person')).toBeInTheDocument();
        expect(screen.getByText('mock event')).toBeInTheDocument();
    });

    it('should change filter when chosing another type option', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <FavouritesCatalog />
                </MemoryRouter>
            </QueryClientProvider>,
        );

        act(() => {
            fireEvent.click(screen.getByText(/подія/i));
        });

        expect(screen.queryByText('mock person')).not.toBeInTheDocument();
        expect(screen.getByText('mock event')).toBeInTheDocument();

        act(() => {
            fireEvent.click(screen.getByText(/постать/i));
        });
        expect(screen.getByText('mock person')).toBeInTheDocument();
        expect(screen.queryByText('mock event')).not.toBeInTheDocument();

        act(() => {
            fireEvent.click(screen.getByText(/усі/i));
        });
        expect(screen.getByText('mock person')).toBeInTheDocument();
        expect(screen.queryByText('mock event')).toBeInTheDocument();
    });
});
