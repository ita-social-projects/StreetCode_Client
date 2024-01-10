import { Test, TestingModule } from '@nestjs/testing';
import { AxiosError, AxiosResponse } from 'axios';
import News from '../../interfaces/News';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { APP_FILTER } from '@nestjs/core';
import { ApiExceptionFilter } from '../../shared/api-exeption-filter/api-exeption.filter';
import { HttpConfigModule } from '../../shared/http-config-module/http-config.module';
import extractMetaTags from '../../shared/utils/extractMetaTags';
import { GetAppService } from '../../shared/get-app-service/get-app.service';
import DEFAULT_META from '../../shared/get-app-service/constants/defaultMeta.constant';

process.env.CLIENT_BUILD_PATH = './src/for-tests';

const mockedNews: News = {
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

const mockedOldNews = {
  ...mockedNews,
  title: 'Old title',
  image: {
    ...mockedNews.image,
    base64: 'oldMockedBase64Data',
    mimeType: 'image/jpeg',
  },
};

async function putOldNewsInCache(
  controller: NewsController,
  service: NewsService,
  url: string = 'news-url',
) {
  const oldNews = { ...mockedOldNews, url };
  const apiResponse = { status: 200, data: oldNews } as AxiosResponse;
  jest.spyOn(service, 'getByUrl').mockResolvedValue(apiResponse);

  await controller.getNews(url);

  expect(controller.getNewsCacheMap.get('1')).toEqual(oldNews);
  expect(controller.getNewsCacheUrlsMap.get(url)).toEqual('1');
}

const apiError = {
  isAxiosError: true,
  response: {
    status: 500,
    data: { message: 'Internal Server Error' },
  },
} as AxiosError;

const apiResponse = { status: 200, data: 1 } as AxiosResponse;

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
        // Arrange
        jest
          .spyOn(newsService, 'getByUrl')
          .mockResolvedValue({ data: mockedNews } as AxiosResponse);

        // Act
        const result = await newsController.getNews('news-url');
        const metaTags = extractMetaTags(result as string);

        // Assert
        expect(metaTags['og:description']).toEqual('Mocked News Title');
        expect(metaTags['og:image']).toEqual(
          'data:image/png;base64,mockedBase64Data',
        );
      });

      it('should return app with DEFAULT meta because news does not exists', async () => {
        // Arrange
        jest.spyOn(newsService, 'getByUrl').mockRejectedValue({
          ...apiError,
          response: {
            status: 404,
            data: { message: "News with the url doesn't exist" },
          },
        } as AxiosError);

        // Act
        const result = await newsController.getNews('non-existent-url');
        const metaTags = extractMetaTags(result as string);
        const { title, description, image } = DEFAULT_META;

        // Assert
        expect(metaTags['og:description']).toEqual(description);
        expect(metaTags['twitter:card']).toEqual(description);
        expect(metaTags['og:image']).toEqual(image);
        expect(metaTags['og:title']).toEqual(title);
      });
    });

    describe('method PUT(news/update)', () => {
      it('should update getNewsCacheMap due to updateNews request success', async () => {
        // Arrange
        jest.spyOn(newsService, 'updateNews').mockResolvedValue(apiResponse);
        await putOldNewsInCache(newsController, newsService);

        // Act
        const result = await newsController.updateNews(mockedNews);
        const newsFromCache = newsController.getNewsCacheMap.get('1');
        const {
          title,
          image: { base64, mimeType },
        } = newsFromCache;

        // Assert
        expect(result).toEqual(apiResponse.data);
        expect(title).toEqual('Mocked News Title');
        expect(base64).toEqual('mockedBase64Data');
        expect(mimeType).toEqual('image/png');
      });

      it('should NOT update getNewsCacheMap due to failed updateNews request', async () => {
        // Arrange
        jest.spyOn(newsService, 'updateNews').mockRejectedValue(apiError);
        await putOldNewsInCache(newsController, newsService);

        // Act
        await expect(async () => {
          await newsController.updateNews(mockedNews);
        }).rejects.toEqual(apiError);
        const newsFromCache = newsController.getNewsCacheMap.get('1');
        const {
          title,
          image: { base64, mimeType },
        } = newsFromCache;

        // Assert
        expect(title).toEqual('Old title');
        expect(base64).toEqual('oldMockedBase64Data');
        expect(mimeType).toEqual('image/jpeg');
      });

      it('should update newsCacheUrlsMap due to updated news.url', async () => {
        // Arrange
        jest.spyOn(newsService, 'updateNews').mockResolvedValue(apiResponse);
        await putOldNewsInCache(newsController, newsService, 'old-url');

        // Act
        const result = await newsController.updateNews(mockedNews);
        const deletedIdOfOldNews =
          newsController.getNewsCacheUrlsMap.get('old-url');
        const changedIdOfNews =
          newsController.getNewsCacheUrlsMap.get('news-url');

        // Assert
        expect(result).toEqual(apiResponse.data);
        expect(deletedIdOfOldNews).toBeUndefined();
        expect(changedIdOfNews).toEqual('1');
      });
    });

    describe('method DELETE(news/delete)', () => {
      it('should delete news and update cache', async () => {
        // Arrange
        jest
          .spyOn(newsService, 'deleteNews')
          .mockResolvedValueOnce(apiResponse);
        await putOldNewsInCache(newsController, newsService);

        // Act
        const result = await newsController.deleteNews('1');

        // Assert
        expect(result).toContain('1');
        expect(newsController.getNewsCacheMap.get('1')).toBeUndefined();
        expect(
          newsController.getNewsCacheUrlsMap.get('news-url'),
        ).toBeUndefined();
      });

      it('should NOT delete news and NOT update cache', async () => {
        // Arrange
        jest.spyOn(newsService, 'deleteNews').mockRejectedValue(apiError);
        await putOldNewsInCache(newsController, newsService);

        // Act
        await expect(async () => {
          await newsController.deleteNews('1');
        }).rejects.toEqual(apiError);

        // Assert
        expect(newsController.getNewsCacheMap.get('1')).toEqual(mockedOldNews);
        expect(newsController.getNewsCacheUrlsMap.get('news-url')).toEqual('1');
      });
    });
  });
});
