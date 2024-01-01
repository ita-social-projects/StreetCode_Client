import { Test, TestingModule } from '@nestjs/testing';
import * as cheerio from 'cheerio';
import { ClientController } from '../client.controller';
import { ClientService, DEFAULT_META } from '../client.service';
import { NewsService } from '../services/news/news.service';
import { StreetcodeService } from '../services/streetcodes/streetcode.service';
import { HttpConfigModule } from '../../../shared/http-config/http-config.module';
import { AxiosResponse } from 'axios';
import News from '../../../interfaces/News';

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
      providers: [ClientService, NewsService, StreetcodeService],
      imports: [HttpConfigModule],
    }).compile();

    clientController = module.get<ClientController>(ClientController);
    clientService = module.get<ClientService>(ClientService);
    newsService = module.get<NewsService>(NewsService);
    streetcodeService = module.get<StreetcodeService>(StreetcodeService);
  });
  describe('news ednpoints', () => {

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

      it('should not update news cache due to failed updateNews request', async () => {
        const apiResponse = {
          status: 500,
          data: '',
          statusText: 'Server error',
        } as AxiosResponse;

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
        expect(newsFromCache.title).toEqual('Old title');
        expect(newsFromCache.image.base64).toEqual('oldMockedBase64Data');
        expect(newsFromCache.image.mimeType).toEqual('image/jpeg');
      });
    });
  });
});
