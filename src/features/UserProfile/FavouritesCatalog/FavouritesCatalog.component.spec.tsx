import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import useMobx from '@stores/root-store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import FavouritesCatalog from './FavouritesCatalog.component';


jest.mock('@stores/root-store', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('FavouritesCatalog', () => {
    let mockStore: any;
    beforeEach(() => {
        mockStore = {
            imagesStore: {
                getImage: jest.fn(() => 'mockImage.png'),
            },
            favouritesCatalogStore: {
                getFavouritesArray: [],
            },
        };
        (useMobx as jest.Mock).mockReturnValue(mockStore);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const setState = jest.fn();
    const useStateMock: any = (initState: any) => [initState, setState];

    const queryClient = new QueryClient();
    it('should render component and its elements', () => {
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <FavouritesCatalog />
                </MemoryRouter>
            </QueryClientProvider>,
        );

        const favourites = container.getElementsByClassName('favourites');
        const filteringDropdown = screen.getByText('Усі');
        const scrollableContainer = container.getElementsByClassName('favouritesContainer');

        expect(favourites).toHaveLength(1);
        expect(favourites[0]).toBeInTheDocument();
        expect(filteringDropdown).toBeInTheDocument();
        expect(scrollableContainer).toHaveLength(1);
        expect(scrollableContainer[0]).toBeInTheDocument();
    });

    it('should change filter when chosing another dropdown option', () => {
        jest.spyOn(React, 'useState').mockImplementation(useStateMock);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <FavouritesCatalog />
                </MemoryRouter>
            </QueryClientProvider>,
        );

        const dropdown = screen.getByRole('button', { name: /усі/i });

        fireEvent.click(dropdown);

        const option = screen.getByText(/постать/i);

        fireEvent.click(option);

        expect(setState).toHaveBeenCalled();
    });
});
