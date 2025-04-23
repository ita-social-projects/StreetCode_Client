/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-imports */
import dayjs from 'dayjs';

import Image from '@/models/media/image.model';
import News from '@/models/news/news.model';
import { PaginationInfo } from '@/models/pagination/pagination.model';

import createMockServer from '../../../../__mocks__/server';

import NewsStore from './news-store';

const testPagination: PaginationInfo = {
    CurrentPage: 1,
    PageSize: 1,
    TotalItems: 1,
    TotalPages: 1,
};

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
const getAllResolver = jest.fn(() => [
    getTestNews(1),
    getTestNews(2),
]);
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
        const testDeleteErrorMessage = 'Delete error message';
        const testGetByUrlErrorMessage = 'GetByUrl error message';

        createMockServer([
            {
                method: 'get',
                path: 'news/getAll',
                resolveFn: getAllResolver,
                headers: {
                    'x-pagination': JSON.stringify(testPagination),
                },
            },
            {
                method: 'get',
                path: `news/getByUrl/${testUrl}`,
                resolveFn: () => getTestNews(1),
            },
            {
                type: 'error',
                method: 'get',
                path: `news/getByUrl/${testErrorUrl}`,
                errorStatusCode: 400,
                errorMessage: testGetByUrlErrorMessage,
            },
            {
                method: 'post',
                path: 'news/create',
                resolveFn: createResolver,
            },
            {
                method: 'put',
                path: 'news/update',
                resolveFn: updateResolver,
            },
            {
                method: 'delete',
                path: `news/delete/${testId}`,
                resolveFn: deleteResolver,
            },
            {
                type: 'error',
                method: 'delete',
                path: `news/delete/${testErrorId}`,
                errorStatusCode: 400,
                errorMessage: testDeleteErrorMessage,
            },
        ]);

        it('calls query with getAll', async () => {
            await store.getAll('', testPagination.PageSize);

            expect(getAllResolver).toHaveBeenCalled();
        });

        it('sets current news id with setCurrentNewsId', async () => {
            await store.getByUrl(testUrl);

            expect(store.CurrentNewsId).toBe(1);
        });

        it('hadles error and don\'t set currentNewsId setter when error from api occurs', async () => {
            const consoleSpy = jest.spyOn(console, 'error');

            await store.getByUrl(testErrorUrl);
            const actualErrorMessage = consoleSpy.mock.lastCall?.[0].data.errorMessage;

            expect(store.CurrentNewsId).toBe(-1);
            expect(actualErrorMessage).toBe(testGetByUrlErrorMessage);
        });

        it('adds new News to collection when createNews is called', async () => {
            const testNews = getTestNews(testId);

            await store.createNews(testNews);

            expect(createResolver).toHaveBeenCalled();
        });

        it('modifies News in collection when updateNews is called', async () => {
            const testNews = getTestNews(testId);

            await store.updateNews(testNews);

            expect(updateResolver).toHaveBeenCalled();
        });

        it('deletes News from collection', async () => {
            await store.deleteNews(testId);

            expect(deleteResolver).toHaveBeenCalled();
        });

        it('handles an error when exception occurs', async () => {
            const consoleSpy = jest.spyOn(console, 'error');

            await store.deleteNews(testErrorId);
            const actualErrorMessage = consoleSpy.mock.lastCall?.[0].data.errorMessage;

            expect(deleteResolver).toHaveBeenCalled();
            expect(actualErrorMessage).toBe(testDeleteErrorMessage);
        });
    });

    describe('HelperMethodsTests', () => {
        it('sets News through setNewsMap', () => {
            store.setNewsMap([
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

            store.setNewsMap(expectedNewsArray);
            const actualNewsArray = store.NewsArray;

            expect(actualNewsArray.length).toBe(expectedNewsArray.length);
            expect(actualNewsArray[0].id).toBe(expectedNewsArray[0].id);
            expect(actualNewsArray[1].id).toBe(expectedNewsArray[1].id);
            expect(actualNewsArray[2].id).toBe(expectedNewsArray[2].id);
        });

        it('sets CurrentPage with setCurrentPage', () => {
            const testCurrentPage = 7;

            store.setCurrentPage(testCurrentPage);

            expect(store.CurrentPage).toBe(testCurrentPage);
        });
    });
});
