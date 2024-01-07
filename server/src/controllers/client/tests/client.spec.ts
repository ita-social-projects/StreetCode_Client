import { Test, TestingModule } from '@nestjs/testing';
import * as cheerio from 'cheerio';
import { ClientController } from '../client.controller';
import { ClientService, DEFAULT_META } from '../client.service';
import { NewsService } from '../services/news/news.service';
import { StreetcodeService } from '../services/streetcodes/streetcode.service';
import { HttpConfigModule } from '../../../shared/http-config/http-config.module';
import { AxiosError, AxiosResponse } from 'axios';
import News from '../../../interfaces/News';
import { StreetcodeUpdate } from '../../../interfaces/StreetcodeUpdate';
import { StreetcodeImageEnum } from '../../../enums/StreetcodeImageEnum';
import { APP_FILTER } from '@nestjs/core';
import { ApiExceptionFilter } from '../../../shared/api-exeption/api-exeption.filter';

process.env.CLIENT_BUILD_PATH = './src/controllers/client/tests';

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

const mockStreetcodeUpdate: StreetcodeUpdate = {
  id: 1,
  index: 123,
  firstName: '',
  lastName: '',
  title: 'Mocked streetcode title',
  teaser: 'Mocked streetcode teaser',
  alias: '',
  status: 'ACTIVE',
  transliterationUrl: 'mocked-streetcode-url',
  eventStartOrPersonBirthDate: new Date('1990-01-01'),
  eventEndOrPersonDeathDate: new Date('2022-01-01'),
  dateString: 'January 1, 2022',
  streetcodeType: '',
  videos: [],
  facts: [],
  relatedFigures: [],
  timelineItems: [],
  partners: [],
  streetcodeArts: [],
  subtitles: [],
  text: '',
  streetcodeCategoryContents: [],
  tags: [],
  statisticRecords: [],
  toponyms: [],
  images: [
    {
      id: 101,
      base64: 'Mocked streetcode base64',
      blobName: 'Mocked streetcode blob name',
      mimeType: 'image/webp',
      imageDetails: {
        id: 201,
        title: 'Sample Image',
        alt: StreetcodeImageEnum.blackandwhite.toString(),
        imageId: 101,
      },
    },
  ],
  audioId: 301,
  audios: [],
  imagesDetails: [],
  transactionLink: [],
};

const apiError = {
  isAxiosError: true,
  response: {
    status: 500,
    data: { message: 'Internal Server Error' },
  },
} as AxiosError;

const extractMetaTags = (html: string): Record<string, string> => {
  const $ = cheerio.load(html);
  const metaTags: Record<string, string> = {};

  $('meta').each((_, element) => {
    const name = $(element).attr('property') || $(element).attr('name');
    const content = $(element).attr('content');
    if (name) {
      metaTags[name] = content;
    }
  });

  return metaTags;
};

describe('ClientController', () => {
  let clientController: ClientController;
  let clientService: ClientService;
  let newsService: NewsService;
  let streetcodeService: StreetcodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        ClientService,
        NewsService,
        StreetcodeService,
        {
          provide: APP_FILTER,
          useClass: ApiExceptionFilter,
        },
      ],
      imports: [HttpConfigModule],
    }).compile();

    clientController = module.get<ClientController>(ClientController);
    clientService = module.get<ClientService>(ClientService);
    newsService = module.get<NewsService>(NewsService);
    streetcodeService = module.get<StreetcodeService>(StreetcodeService);
  });
  describe('news endpoints', () => {
    describe('method GET(news/:url)', () => {
      it('should return index.html with news meta', async () => {
        jest
          .spyOn(newsService, 'getByUrl')
          .mockResolvedValue({ data: mockNews } as AxiosResponse);

        const result = await clientController.getNews('news-url');

        const metaTags = extractMetaTags(result as string);

        expect(metaTags['og:description']).toEqual('Mocked News Title');
        expect(metaTags['og:image']).toEqual(
          'data:image/png;base64,mockedBase64Data',
        );
      });

      it('should return app without default meta because news does not exists', async () => {
        jest
          .spyOn(newsService, 'getByUrl')
          .mockResolvedValue({ data: undefined, status: 404 } as AxiosResponse);

        const result = await clientController.getNews('non-existent-url');

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
        clientController.newsCacheMap.set('1', {
          ...mockNews,
          title: 'Old title',
          image: {
            ...mockNews.image,
            base64: 'oldMockedBase64Data',
            mimeType: 'image/jpeg',
          },
        });

        const result = await clientController.updateNews(mockNews);
        const newsFromCache = clientController.newsCacheMap.get('1');

        expect(result).toEqual(apiResponse);
        expect(newsFromCache.title).toEqual('Mocked News Title');
        expect(newsFromCache.image.base64).toEqual('mockedBase64Data');
        expect(newsFromCache.image.mimeType).toEqual('image/png');
      });

      it('should not update newsCacheMap due to failed updateNews request', async () => {
        jest.spyOn(newsService, 'updateNews').mockRejectedValue(apiError);

        clientController.newsCacheMap.set('1', {
          ...mockNews,
          title: 'Old title',
          image: {
            ...mockNews.image,
            base64: 'oldMockedBase64Data',
            mimeType: 'image/jpeg',
          },
        });

        await expect(async () => {
          await clientController.updateNews(mockNews);
        }).rejects.toEqual(apiError);
        const newsFromCache = clientController.newsCacheMap.get('1');

        expect(newsFromCache.title).toEqual('Old title');
        expect(newsFromCache.image.base64).toEqual('oldMockedBase64Data');
        expect(newsFromCache.image.mimeType).toEqual('image/jpeg');
      });

      it('should update newsCacheUrlsMap due to updated news.url', async () => {
        const apiResponse = { status: 200, data: 2 } as AxiosResponse;
        jest.spyOn(newsService, 'updateNews').mockResolvedValue(apiResponse);
        clientController.newsCacheUrlsMap.set('old-url', '1');
        clientController.newsCacheMap.set('1', {
          ...mockNews,
          url: 'old-url',
        });

        const result = await clientController.updateNews(mockNews);
        const deletedIdOfOldNews =
          clientController.newsCacheUrlsMap.get('old-url');
        const changedIdOfNews =
          clientController.newsCacheUrlsMap.get('news-url');

        expect(result).toEqual(apiResponse);
        expect(deletedIdOfOldNews).toBeUndefined();
        expect(changedIdOfNews).toEqual('1');
      });
    });
  });

  describe('streetcode endpoints', () => {
    describe('method GET(/:url)', () => {
      it('should return index.html with streetcode meta', async () => {
        const getImagesOfStreetcodeApiResponse = {
          status: 200,
          data: mockStreetcodeUpdate.images,
        } as AxiosResponse;

        jest
          .spyOn(streetcodeService, 'getByUrl')
          .mockResolvedValue({ data: mockStreetcodeUpdate } as AxiosResponse);

        jest
          .spyOn(streetcodeService, 'getImagesOfStreetcode')
          .mockResolvedValue(getImagesOfStreetcodeApiResponse);

        const result = await clientController.getStreetcode(
          'mocked-streetcode-url',
        );

        const metaTags = extractMetaTags(result as string);

        expect(metaTags['og:description']).toEqual(DEFAULT_META.description);
        expect(metaTags['og:title']).toEqual('Mocked streetcode title');
        expect(metaTags['og:image']).toEqual(
          'data:image/webp;base64,Mocked streetcode base64',
        );
      });

      it('should return app without default meta because streetcode does not exists', async () => {
        jest
          .spyOn(streetcodeService, 'getByUrl')
          .mockResolvedValue({ data: undefined, status: 404 } as AxiosResponse);

        const result = await clientController.getStreetcode('non-existent-url');

        const metaTags = extractMetaTags(result as string);

        expect(metaTags['og:description']).toEqual(DEFAULT_META.description);
        expect(metaTags['twitter:card']).toEqual(DEFAULT_META.description);
        expect(metaTags['og:image']).toEqual(DEFAULT_META.image);
        expect(metaTags['og:title']).toEqual(DEFAULT_META.title);
      });
    });

    describe('method PUT(streetcode/update)', () => {
      it('should update streetcodeCacheMap due to updateStreetcode request success', async () => {
        const updateStreetcodeApiResponse = {
          status: 200,
          data: 1,
        } as AxiosResponse;
        const getImagesOfStreetcodeApiResponse = {
          status: 200,
          data: mockStreetcodeUpdate.images,
        } as AxiosResponse;

        jest
          .spyOn(streetcodeService, 'updateStreetcode')
          .mockResolvedValue(updateStreetcodeApiResponse);
        jest
          .spyOn(streetcodeService, 'getImagesOfStreetcode')
          .mockResolvedValue(getImagesOfStreetcodeApiResponse);
        clientController.streetcodeCacheMap.set('1', {
          title: 'Old title',
          image: {
            ...mockStreetcodeUpdate.images[0],
            base64: 'oldMockedBase64Data',
            mimeType: 'image/png',
          },
        });

        const result =
          await clientController.updateStreetcode(mockStreetcodeUpdate);
        const streetcodeFromCache =
          clientController.streetcodeCacheMap.get('1');

        expect(result).toEqual(updateStreetcodeApiResponse);
        expect(streetcodeFromCache.title).toEqual('Mocked streetcode title');
        expect(streetcodeFromCache.image.base64).toEqual(
          'Mocked streetcode base64',
        );
        expect(streetcodeFromCache.image.mimeType).toEqual('image/webp');
      });

      it('should not update streetcodeCacheMap due to failed updateStreetcode request', async () => {
        jest
          .spyOn(streetcodeService, 'updateStreetcode')
          .mockRejectedValue(apiError);

        clientController.streetcodeCacheMap.set('1', {
          title: 'Old title',
          image: {
            ...mockStreetcodeUpdate.images[0],
            base64: 'oldMockedBase64Data',
            mimeType: 'image/png',
          },
        });

        await expect(async () => {
          await clientController.updateStreetcode(mockStreetcodeUpdate);
        }).rejects.toEqual(apiError);
        const streetcodeFromCache =
          clientController.streetcodeCacheMap.get('1');

        expect(streetcodeFromCache.title).toEqual('Old title');
        expect(streetcodeFromCache.image.base64).toEqual('oldMockedBase64Data');
        expect(streetcodeFromCache.image.mimeType).toEqual('image/png');
      });

      it('should update streetcodeCacheUrlsMap due to updated streetcode.transliterationUrl', async () => {
        const updateStreetcodeApiResponse = {
          status: 200,
          data: 1,
        } as AxiosResponse;
        const getImagesOfStreetcodeApiResponse = {
          status: 200,
          data: mockStreetcodeUpdate.images,
        } as AxiosResponse;

        jest
          .spyOn(streetcodeService, 'updateStreetcode')
          .mockResolvedValue(updateStreetcodeApiResponse);
        jest
          .spyOn(streetcodeService, 'getImagesOfStreetcode')
          .mockResolvedValue(getImagesOfStreetcodeApiResponse);
        clientController.streetcodeCacheMap.set('1', {
          title: mockStreetcodeUpdate.title,
          image: { ...mockStreetcodeUpdate.images[0] },
          transliterationUrl: 'old-url',
        });
        clientController.streetcodeCacheUrlsMap.set('old-url', '1');

        const result =
          await clientController.updateStreetcode(mockStreetcodeUpdate);
        const deletedIdOfOldStreetcode =
          clientController.streetcodeCacheUrlsMap.get('old-url');
        const changedIdOfStreetcode =
          clientController.streetcodeCacheUrlsMap.get('mocked-streetcode-url');

        expect(result).toEqual(updateStreetcodeApiResponse);
        expect(deletedIdOfOldStreetcode).toBeUndefined();
        expect(changedIdOfStreetcode).toEqual('1');
      });
    });
  });
});
