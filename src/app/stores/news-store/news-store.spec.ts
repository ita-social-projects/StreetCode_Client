/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-imports */
import { QueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

import Image from '@/models/media/image.model';
import News from '@/models/news/news.model';
import { PaginationInfo } from '@/models/pagination/pagination.model';

import createMockServer from '../../../../__mocks__/server';

import NewsStore from './news-store';

const getTestNews = (
    id: number,
    title?: string,
    text?: string,
    url?: string,
    imageId?: number,
    image?: Image,
    creationDate?: dayjs.Dayjs,
) => ({
    id,
    title: title ?? 'TestTitle',
    text: text ?? 'TestText',
    url: url ?? 'TestUrl',
    imageId: imageId ?? 1,
    image,
    creationDate: creationDate ?? dayjs(),
});

describe('news-store', () => {
    const store = new NewsStore();
    const testUrl = 'testUrl';

    describe('api methods tests', () => {
        createMockServer([
            {
                method: 'get',
                path: `news/getByUrl/${testUrl}`,
                res: () => getTestNews(1),
            },
        ]);

        it('sets current news id with setCurrentNewsId', async () => {
            await store.setCurrentNewsId(testUrl);

            expect(store.currentNews).toBe(1);
        });
    });

    describe('helper methods tests', () => {
        it('sets current news id with setter', async () => {
            store.setNews = getTestNews(99);

            expect(store.currentNews).toBe(99);
        });

        it('gets default pagination info', async () => {
            const paginationInfo: PaginationInfo = store.getPaginationInfo;

            expect(paginationInfo).toBeTruthy();
            expect(paginationInfo.PageSize).toBe(10);
            expect(paginationInfo.CurrentPage).toBe(1);
            expect(paginationInfo.TotalItems).toBe(1);
            expect(paginationInfo.TotalPages).toBe(1);
        });

        it('sets pagination info', async () => {
            const expectedPaginationInfo: PaginationInfo = {
                PageSize: 7,
                CurrentPage: 3,
                TotalPages: 10,
                TotalItems: 69,
            };

            store.setPaginationInfo(expectedPaginationInfo);
            const actualPaginationInfo: PaginationInfo = store.getPaginationInfo;

            expect(actualPaginationInfo).toBeTruthy();
            expect(actualPaginationInfo.PageSize).toBe(expectedPaginationInfo.PageSize);
            expect(actualPaginationInfo.CurrentPage).toBe(expectedPaginationInfo.CurrentPage);
            expect(actualPaginationInfo.TotalItems).toBe(expectedPaginationInfo.TotalItems);
            expect(actualPaginationInfo.TotalPages).toBe(expectedPaginationInfo.TotalPages);
        });
    });
});
