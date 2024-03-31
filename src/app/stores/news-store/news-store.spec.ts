/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-imports */
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
    creationDate: creationDate ?? dayjs(new Date('01-01-2000')),
});
let store: NewsStore;
const createResolver = jest.fn();
const updateResolver = jest.fn();
const deleteResolver = jest.fn();

beforeEach(() => {
    store = new NewsStore();
});

describe('news-store', () => {
    describe('ApiMethodsTests', () => {
        const testId = 1;
        const testErrorId = 10;
        const testUrl = 'testUrl';
        const testErrorUrl = 'testErrorUrl';

        createMockServer([
            {
                method: 'get',
                path: `news/getByUrl/${testUrl}`,
                responseFn: () => getTestNews(1),
            },
            {
                type: 'error',
                method: 'get',
                path: `news/getByUrl/${testErrorUrl}`,
                errorStatusCode: 400,
            },
            {
                method: 'post',
                path: 'news/create',
                responseFn: createResolver,
            },
            {
                method: 'put',
                path: 'news/update',
                responseFn: updateResolver,
            },
            {
                method: 'delete',
                path: `news/delete/${testId}`,
                responseFn: deleteResolver,
            },
            {
                type: 'error',
                method: 'delete',
                path: `news/delete/${testErrorId}`,
                errorStatusCode: 400,
            },
        ]);

        it('sets current news id with setCurrentNewsId', async () => {
            await store.getByUrl(testUrl);

            expect(store.CurrentNewsId).toBe(1);
        });

        it('hadles error and don\'t set currentNewsId setter when error from api occurs', async () => {
            const consoleSpy = jest.spyOn(console, 'log');

            await store.getByUrl(testErrorUrl);

            expect(store.CurrentNewsId).toBe(-1);
            expect(consoleSpy).toHaveBeenCalledWith(400);
        });

        it('adds new News to collection when createNews is called', async () => {
            const testNews = getTestNews(testId);

            await store.createNews(testNews);

            expect(createResolver).toHaveBeenCalledTimes(1);
        });

        it('modifies News in collection when updateNews is called', async () => {
            const testNews = getTestNews(testId);

            await store.updateNews(testNews);

            expect(updateResolver).toHaveBeenCalledTimes(1);
        });

        it('deletes News from collection', async () => {
            await store.deleteNews(testId);

            expect(deleteResolver).toHaveBeenCalledTimes(1);
        });

        it('handles an error when exception occurs', async () => {
            const consoleSpy = jest.spyOn(console, 'log');

            await store.deleteNews(testErrorId);

            expect(deleteResolver).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenCalledWith(400);
        });
    });

    describe('HelperMethodsTests', () => {
        it('sets News through setInternalMap', () => {
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

        it('sets current news id with News setter', () => {
            store.CurrentNewsId = getTestNews(99).id;

            expect(store.CurrentNewsId).toBe(99);
        });

        it('gets current news id with CurrentNewsId getter', () => {
            store.CurrentNewsId = getTestNews(99).id;

            expect(store.CurrentNewsId).toBe(99);
        });

        it('add new News to NewsMap with addNews', () => {
            store.addNews(getTestNews(99));

            expect(store.NewsMap).toBeTruthy();
            expect(store.NewsMap.size).toBe(1);
            expect(store.NewsMap.keys().next().value).toBe(99);
        });

        it('gets default pagination info with PaginationInfo getter', () => {
            const paginationInfo: PaginationInfo = store.PaginationInfo;

            expect(paginationInfo).toBeTruthy();
            expect(paginationInfo.PageSize).toBe(10);
            expect(paginationInfo.CurrentPage).toBe(1);
            expect(paginationInfo.TotalItems).toBe(1);
            expect(paginationInfo.TotalPages).toBe(1);
        });

        it('sets pagination info with PaginationInfo setter', () => {
            const expectedPaginationInfo: PaginationInfo = {
                PageSize: 7,
                CurrentPage: 3,
                TotalPages: 10,
                TotalItems: 69,
            };

            store.PaginationInfo = (expectedPaginationInfo);
            const actualPaginationInfo: PaginationInfo = store.PaginationInfo;

            expect(actualPaginationInfo).toBeTruthy();
            expect(actualPaginationInfo.PageSize).toBe(expectedPaginationInfo.PageSize);
            expect(actualPaginationInfo.CurrentPage).toBe(expectedPaginationInfo.CurrentPage);
            expect(actualPaginationInfo.TotalItems).toBe(expectedPaginationInfo.TotalItems);
            expect(actualPaginationInfo.TotalPages).toBe(expectedPaginationInfo.TotalPages);
        });

        it('gets News array with NewsArray getter', () => {
            const expectedNewsArray: News[] = [
                getTestNews(1),
                getTestNews(2),
                getTestNews(3),
            ];

            store.setInternalMap(expectedNewsArray);
            const actualNewsArray = store.NewsArray;

            expect(actualNewsArray.length).toBe(expectedNewsArray.length);
            expect(actualNewsArray[0].id).toBe(expectedNewsArray[0].id);
            expect(actualNewsArray[1].id).toBe(expectedNewsArray[1].id);
            expect(actualNewsArray[2].id).toBe(expectedNewsArray[2].id);
        });
    });
});
