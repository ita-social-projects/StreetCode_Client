import { Test, TestingModule } from '@nestjs/testing';
import { AxiosError, AxiosResponse } from 'axios';
import News from '../../interfaces/News';
import { NewsService } from './news.service';
import {
  DEFAULT_META,
  GetAppService,
} from '../../shared/get-app-service/get-app.service';
import { NewsController } from './news.controller';
import { APP_FILTER } from '@nestjs/core';
import { ApiExceptionFilter } from '../../shared/api-exeption-filter/api-exeption.filter';
import { HttpConfigModule } from '../../shared/http-config-module/http-config.module';
import extractMetaTags from '../../shared/utils/extractMetaTags';

process.env.CLIENT_BUILD_PATH = './src/for-tests';

const mockNews: News = {
  id: 1,
  title: 'Mocked News Title',
  text: 'Mocked News Text',
  url: 'news-url',
  imageId: 123,
  image: {
    id: 123,
    base64: 'mockedBase64Data',
    blobName: 'mockedBlobName',
    mimeType: 'image/png',
    imageDetails: {
      id: 456,
      title: 'Mocked Image Title',
      alt: 'Mocked Image Alt',
      imageId: 123,
    },
  },
  creationDate: '2021-01-01',
};

const apiError = {
  isAxiosError: true,
  response: {
    status: 500,
    data: { message: 'Internal Server Error' },
  },
} as AxiosError;

describe('NewsController', () => {
  let newsController: NewsController;
  let newsService: NewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [
        GetAppService,
        NewsService,
        {
          provide: APP_FILTER,
          useClass: ApiExceptionFilter,
        },
      ],
      imports: [HttpConfigModule],
    }).compile();

    newsController = module.get<NewsController>(NewsController);
    newsService = module.get<NewsService>(NewsService);
  });

  describe('news endpoints', () => {
    describe('method GET(news/:url)', () => {
      it('should return index.html with news meta', async () => {
        jest
          .spyOn(newsService, 'getByUrl')
          .mockResolvedValue({ data: mockNews } as AxiosResponse);

        const result = await newsController.getNews('news-url');

        const metaTags = extractMetaTags(result as string);

        expect(metaTags['og:description']).toEqual('Mocked News Title');
        expect(metaTags['og:image']).toEqual(
          'data:image/png;base64,mockedBase64Data',
        );
      });

      it('should return app with default meta because news does not exists', async () => {
        jest
          .spyOn(newsService, 'getByUrl')
          .mockResolvedValue({ data: undefined, status: 404 } as AxiosResponse);

        const result = await newsController.getNews('non-existent-url');

        const metaTags = extractMetaTags(result as string);

        expect(metaTags['og:description']).toEqual(DEFAULT_META.description);
        expect(metaTags['twitter:card']).toEqual(DEFAULT_META.description);
        expect(metaTags['og:image']).toEqual(DEFAULT_META.image);
        expect(metaTags['og:title']).toEqual(DEFAULT_META.title);
      });
    });

    describe('method PUT(news/update)', () => {
      it('should update newsCacheMap due to updateNews request success', async () => {
        const apiResponse = { status: 200, data: 1 } as AxiosResponse;
        jest.spyOn(newsService, 'updateNews').mockResolvedValue(apiResponse);
        newsController.newsCacheMap.set('1', {
          ...mockNews,
          title: 'Old title',
          image: {
            ...mockNews.image,
            base64: 'oldMockedBase64Data',
            mimeType: 'image/jpeg',
          },
        });

        const result = await newsController.updateNews(mockNews);
        const newsFromCache = newsController.newsCacheMap.get('1');

        expect(result).toEqual(apiResponse);
        expect(newsFromCache.title).toEqual('Mocked News Title');
        expect(newsFromCache.image.base64).toEqual('mockedBase64Data');
        expect(newsFromCache.image.mimeType).toEqual('image/png');
      });

      it('should not update newsCacheMap due to failed updateNews request', async () => {
        jest.spyOn(newsService, 'updateNews').mockRejectedValue(apiError);

        newsController.newsCacheMap.set('1', {
          ...mockNews,
          title: 'Old title',
          image: {
            ...mockNews.image,
            base64: 'oldMockedBase64Data',
            mimeType: 'image/jpeg',
          },
        });

        await expect(async () => {
          await newsController.updateNews(mockNews);
        }).rejects.toEqual(apiError);
        const newsFromCache = newsController.newsCacheMap.get('1');

        expect(newsFromCache.title).toEqual('Old title');
        expect(newsFromCache.image.base64).toEqual('oldMockedBase64Data');
        expect(newsFromCache.image.mimeType).toEqual('image/jpeg');
      });

      it('should update newsCacheUrlsMap due to updated news.url', async () => {
        const apiResponse = { status: 200, data: 2 } as AxiosResponse;
        jest.spyOn(newsService, 'updateNews').mockResolvedValue(apiResponse);
        newsController.newsCacheUrlsMap.set('old-url', '1');
        newsController.newsCacheMap.set('1', {
          ...mockNews,
          url: 'old-url',
        });

        const result = await newsController.updateNews(mockNews);
        const deletedIdOfOldNews =
          newsController.newsCacheUrlsMap.get('old-url');
        const changedIdOfNews = newsController.newsCacheUrlsMap.get('news-url');

        expect(result).toEqual(apiResponse);
        expect(deletedIdOfOldNews).toBeUndefined();
        expect(changedIdOfNews).toEqual('1');
      });
    });
  });
});
