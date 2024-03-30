/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-imports */
import dayjs from 'dayjs';

import Image from '@/models/media/image.model';
import News from '@/models/news/news.model';

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
    createMockServer([
        {
            method: 'get',
            path: `news/getByUrl/${testUrl}`,
            res: () => getTestNews(1),
        },
    ]);

    it('sets current news id with setter', async () => {
        const store = new NewsStore();
        store.setNews = getTestNews(99);

        expect(store.currentNews).toBe(99);
    });

    it('sets current news id with setCurrentNewsId', async () => {
        const store = new NewsStore();
        await store.setCurrentNewsId(testUrl);

        expect(store.currentNews).toBe(1);
    });
});
