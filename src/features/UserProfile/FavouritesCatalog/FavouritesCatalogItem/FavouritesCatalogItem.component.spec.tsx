import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from "@testing-library/react";

import * as analyticsUtils from '@/app/common/utils/googleAnalytics.unility'; 
import Image from "@/models/media/image.model";
import { StreetcodeType } from "@/models/streetcode/streetcode-types.model";

import '@testing-library/jest-dom';

import FavouritesCatalogItem from "./FavouritesCatalogItem.component";

jest.mock('@/app/common/utils/googleAnalytics.unility', () => ({
    toStreetcodeRedirectClickEvent: jest.fn(),
}));

const mockStreetcode = {
    id: 1,
    title: 'mock',
    alias: 'mock alias',
    imageId: 1,
    transliterationUrl: 'mock',
    type: StreetcodeType.Person,
};

const mockImage = {
    id: 1,
    base64: 'base64',
    blobName: 'blobName',
    mimeType: 'image/jpeg',
} as Image;

describe('FavouritesCatalogItem', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const queryClient = new QueryClient();
    it('should render component and its elements', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <FavouritesCatalogItem
                        key={mockStreetcode.id}
                        streetcode={mockStreetcode}
                        image={mockImage}
                    />
                </MemoryRouter>
            </QueryClientProvider>,
        );

        const linkCard = screen.getByRole('link');

        expect(linkCard).toBeInTheDocument();
    });

    it('should redirect when clicking on card', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <FavouritesCatalogItem
                        key={mockStreetcode.id}
                        streetcode={mockStreetcode}
                        image={mockImage}
                    />
                </MemoryRouter>
            </QueryClientProvider>,
        );

        const linkCard = screen.getByRole('link');

        fireEvent.click(linkCard);

        expect(analyticsUtils.toStreetcodeRedirectClickEvent).toHaveBeenCalledWith(
            `${mockStreetcode.transliterationUrl}`,
            'profile',
        );
    });
});
