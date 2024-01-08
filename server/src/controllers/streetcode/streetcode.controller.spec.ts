import { Test, TestingModule } from '@nestjs/testing';
import { AxiosError, AxiosResponse } from 'axios';

import { APP_FILTER } from '@nestjs/core';
import { StreetcodeController } from './streetcode.controller';
import extractMetaTags from '../../shared/utils/extractMetaTags';
import { StreetcodeUpdate } from '../../interfaces/StreetcodeUpdate';
import { StreetcodeImageEnum } from '../../enums/StreetcodeImageEnum';
import { StreetcodeService } from './streetcode.service';
import {
  DEFAULT_META,
  GetAppService,
} from '../../shared/get-app-service/get-app.service';
import { ApiExceptionFilter } from '../../shared/api-exeption-filter/api-exeption.filter';
import { HttpConfigModule } from '../../shared/http-config-module/http-config.module';

process.env.CLIENT_BUILD_PATH = './src/for-tests';

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

describe('StreetcodeController', () => {
  let streetcodeController: StreetcodeController;
  let streetcodeService: StreetcodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StreetcodeController],
      providers: [
        GetAppService,
        StreetcodeService,
        {
          provide: APP_FILTER,
          useClass: ApiExceptionFilter,
        },
      ],
      imports: [HttpConfigModule],
    }).compile();

    streetcodeController =
      module.get<StreetcodeController>(StreetcodeController);
    streetcodeService = module.get<StreetcodeService>(StreetcodeService);
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

        const result = await streetcodeController.getStreetcode(
          'mocked-streetcode-url',
        );

        const metaTags = extractMetaTags(result as string);

        expect(metaTags['og:description']).toEqual(DEFAULT_META.description);
        expect(metaTags['og:title']).toEqual('Mocked streetcode title');
        expect(metaTags['og:image']).toEqual(
          'data:image/webp;base64,Mocked streetcode base64',
        );
      });

      it('should return app with default meta because streetcode does not exists', async () => {
        jest.spyOn(streetcodeService, 'getByUrl').mockRejectedValue({
          ...apiError,
          response: {
            status: 404,
            data: { message: "Streetcode with the url doesn't exist" },
          },
        } as AxiosError);

        const result =
          await streetcodeController.getStreetcode('non-existent-url');

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
        streetcodeController.streetcodeCacheMap.set('1', {
          title: 'Old title',
          image: {
            ...mockStreetcodeUpdate.images[0],
            base64: 'oldMockedBase64Data',
            mimeType: 'image/png',
          },
        });

        const result =
          await streetcodeController.updateStreetcode(mockStreetcodeUpdate);
        const streetcodeFromCache =
          streetcodeController.streetcodeCacheMap.get('1');

        expect(result).toEqual(updateStreetcodeApiResponse.data);
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

        streetcodeController.streetcodeCacheMap.set('1', {
          title: 'Old title',
          image: {
            ...mockStreetcodeUpdate.images[0],
            base64: 'oldMockedBase64Data',
            mimeType: 'image/png',
          },
        });

        await expect(async () => {
          await streetcodeController.updateStreetcode(mockStreetcodeUpdate);
        }).rejects.toEqual(apiError);
        const streetcodeFromCache =
          streetcodeController.streetcodeCacheMap.get('1');

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
        streetcodeController.streetcodeCacheMap.set('1', {
          title: mockStreetcodeUpdate.title,
          image: { ...mockStreetcodeUpdate.images[0] },
          transliterationUrl: 'old-url',
        });
        streetcodeController.streetcodeCacheUrlsMap.set('old-url', '1');

        const result =
          await streetcodeController.updateStreetcode(mockStreetcodeUpdate);
        const deletedIdOfOldStreetcode =
          streetcodeController.streetcodeCacheUrlsMap.get('old-url');
        const changedIdOfStreetcode =
          streetcodeController.streetcodeCacheUrlsMap.get(
            'mocked-streetcode-url',
          );

        expect(result).toEqual(updateStreetcodeApiResponse);
        expect(deletedIdOfOldStreetcode).toBeUndefined();
        expect(changedIdOfStreetcode).toEqual('1');
      });
    });
  });
});
