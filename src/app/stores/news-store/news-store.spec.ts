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
            const store = new NewsStore();

            await store.setCurrentNewsId(testUrl);

            expect(store.currentNews).toBe(1);
        });
    });

    describe('helper methods tests', () => {
        it('sets News through setInternalMap', async () => {
            const store = new NewsStore();

            store.setInternalMap([
                getTestNews(1),
                getTestNews(2),
                getTestNews(3),
            ]);

            expect(store.NewsMap).toBeTruthy();
            expect(store.NewsMap.size).toBe(3);
            expect(store.NewsMap.get(1)?.id).toBe(1);
            expect(store.NewsMap.get(2)?.id).toBe(2);
            expect(store.NewsMap.get(3)?.id).toBe(3);
        });

        it('sets current news id with setNews', async () => {
            const store = new NewsStore();

            store.setNews = getTestNews(99);

            expect(store.currentNews).toBe(99);
        });

        it('gets current news id with getNewsId', async () => {
            const store = new NewsStore();

            store.setNews = getTestNews(99);

            expect(store.getNewsId).toBe(99);
        });

        it('add new News to NewsMap with setItem', async () => {
            const store = new NewsStore();

            store.setItem(getTestNews(99));

            expect(store.NewsMap).toBeTruthy();
            expect(store.NewsMap.size).toBe(1);
            expect(store.NewsMap.keys().next().value).toBe(99);
        });

        it('gets default pagination info with getPaginationInfo', async () => {
            const store = new NewsStore();

            const paginationInfo: PaginationInfo = store.getPaginationInfo;

            expect(paginationInfo).toBeTruthy();
            expect(paginationInfo.PageSize).toBe(10);
            expect(paginationInfo.CurrentPage).toBe(1);
            expect(paginationInfo.TotalItems).toBe(1);
            expect(paginationInfo.TotalPages).toBe(1);
        });

        it('sets pagination info with setPaginationInfo', async () => {
            const store = new NewsStore();

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
