import { Test, TestingModule } from '@nestjs/testing';
import { AxiosError, AxiosResponse } from 'axios';

import { APP_FILTER } from '@nestjs/core';
import { StreetcodeController } from './streetcode.controller';
import extractMetaTags from '../../shared/utils/extractMetaTags';
import { StreetcodeUpdate } from '../../interfaces/StreetcodeUpdate';
import { StreetcodeImageEnum } from '../../enums/StreetcodeImageEnum';
import { StreetcodeService } from './streetcode.service';
import { GetAppService } from '../../shared/get-app-service/get-app.service';
import { ApiExceptionFilter } from '../../shared/api-exeption-filter/api-exeption.filter';
import { HttpConfigModule } from '../../shared/http-config-module/http-config.module';
import { StreetcodeCache } from '../../interfaces/StreetcodeCache';
import { Streetcode } from '../../interfaces/Streetcode';
import DEFAULT_META from '../../shared/get-app-service/constants/defaultMeta.constant';
import URLS_TO_OMIT from './constants/urlsToOmit.constant';

process.env.CLIENT_BUILD_PATH = './src/for-tests';

const mockedStreetcodeUpdate: StreetcodeUpdate = {
  id: 1,
  title: 'Mocked streetcode title',
  transliterationUrl: 'mocked-streetcode-url',
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
};

const mockedStreetcode: Streetcode = mockedStreetcodeUpdate as Streetcode;

const oldMockedStreetcodeCache: StreetcodeCache = {
  title: 'Old title',
  image: {
    ...mockedStreetcodeUpdate.images[0],
    base64: 'oldMockedBase64Data',
    mimeType: 'image/png',
  },
  transliterationUrl: mockedStreetcodeUpdate.transliterationUrl,
};

const updateStreetcodeApiResponse = {
  status: 200,
  data: 1,
} as AxiosResponse;

const getImagesOfStreetcodeApiResponse = {
  status: 200,
  data: mockedStreetcodeUpdate.images,
} as AxiosResponse;

const getStreetcodeApiResponse = {
  status: 200,
  data: mockedStreetcode,
} as AxiosResponse;

const apiError = {
  isAxiosError: true,
  response: {
    status: 500,
    data: { message: 'Internal Server Error' },
  },
} as AxiosError;

async function putOldStreetcodeInCache(
  controller: StreetcodeController,
  service: StreetcodeService,
  transliterationUrl: string = 'mocked-streetcode-url',
) {
  const oldStreetcode = {
    ...mockedStreetcodeUpdate,
    ...oldMockedStreetcodeCache,
    transliterationUrl,
  };

  const apiResponse = { status: 200, data: oldStreetcode } as AxiosResponse;
  jest.spyOn(service, 'getByUrl').mockResolvedValue(apiResponse);

  const getImagesOfStreetcodeApiResponse = {
    status: 200,
    data: [oldMockedStreetcodeCache.image],
  } as AxiosResponse;
  jest
    .spyOn(service, 'getImagesOfStreetcode')
    .mockResolvedValue(getImagesOfStreetcodeApiResponse);

  await controller.getStreetcode(transliterationUrl);

  expect(controller.getStreetcodeCacheMap.get('1')).toEqual({
    ...oldMockedStreetcodeCache,
    transliterationUrl,
  });
  expect(controller.getStreetcodeCacheUrlsMap.get(transliterationUrl)).toEqual(
    '1',
  );
}

function mockStreetcodeService(service: StreetcodeService) {
  jest.spyOn(service, 'getByUrl').mockResolvedValue(getStreetcodeApiResponse);

  jest
    .spyOn(service, 'updateStreetcode')
    .mockResolvedValue(updateStreetcodeApiResponse);
  jest
    .spyOn(service, 'getImagesOfStreetcode')
    .mockResolvedValue(getImagesOfStreetcodeApiResponse);
}

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
        // Arrange
        mockStreetcodeService(streetcodeService);

        // Act
        const result = await streetcodeController.getStreetcode(
          'mocked-streetcode-url',
        );

        // Assert
        const metaTags = extractMetaTags(result as string);
        expect(metaTags['og:description']).toEqual(DEFAULT_META.description);
        expect(metaTags['og:title']).toEqual('Mocked streetcode title');
        expect(metaTags['og:image']).toEqual(
          'data:image/webp;base64,Mocked streetcode base64',
        );
      });

      it('should return app with DEFAULT meta because streetcode does not exists', async () => {
        // Arrange
        jest.spyOn(streetcodeService, 'getByUrl').mockRejectedValue({
          ...apiError,
          response: {
            status: 404,
            data: { message: "Streetcode with the url doesn't exist" },
          },
        } as AxiosError);

        // Act
        const result =
          await streetcodeController.getStreetcode('non-existent-url');
        const { title, description, image } = DEFAULT_META;

        // Assert
        const metaTags = extractMetaTags(result as string);
        expect(metaTags['og:description']).toEqual(description);
        expect(metaTags['twitter:card']).toEqual(description);
        expect(metaTags['og:image']).toEqual(image);
        expect(metaTags['og:title']).toEqual(title);
      });

      it('should return app with DEFAULT meta because url is in URLS_TO_OMIT', async () => {
        // Arrange

        // Act
        const result = await streetcodeController.getStreetcode(
          URLS_TO_OMIT[0],
        );
        const { title, description, image } = DEFAULT_META;

        // Assert
        const metaTags = extractMetaTags(result as string);
        expect(metaTags['og:description']).toEqual(description);
        expect(metaTags['twitter:card']).toEqual(description);
        expect(metaTags['og:image']).toEqual(image);
        expect(metaTags['og:title']).toEqual(title);
      });
    });

    describe('method PUT(streetcode/update)', () => {
      it('should update streetcodeCacheMap due to updateStreetcode request success', async () => {
        // Arrange
        await putOldStreetcodeInCache(streetcodeController, streetcodeService); // important to place before other mocks
        mockStreetcodeService(streetcodeService);

        // Act
        const result = await streetcodeController.updateStreetcode(
          mockedStreetcodeUpdate,
        );
        const streetcodeFromCache =
          streetcodeController.getStreetcodeCacheMap.get('1');
        const {
          title,
          image: { base64, mimeType },
        } = streetcodeFromCache;

        // Assert
        expect(result).toEqual(updateStreetcodeApiResponse.data);
        expect(title).toEqual('Mocked streetcode title');
        expect(base64).toEqual('Mocked streetcode base64');
        expect(mimeType).toEqual('image/webp');
      });

      it('should NOT update streetcodeCacheMap due to failed updateStreetcode request', async () => {
        // Arrange
        await putOldStreetcodeInCache(streetcodeController, streetcodeService); // important to place before other mocks

        jest
          .spyOn(streetcodeService, 'updateStreetcode')
          .mockRejectedValue(apiError);

        // Act
        await expect(async () => {
          await streetcodeController.updateStreetcode(mockedStreetcodeUpdate);
        }).rejects.toEqual(apiError);
        const streetcodeFromCache =
          streetcodeController.getStreetcodeCacheMap.get('1');
        const {
          title,
          transliterationUrl,
          image: { base64, mimeType },
        } = streetcodeFromCache;

        // Assert
        expect(title).toEqual('Old title');
        expect(transliterationUrl).toEqual('mocked-streetcode-url');
        expect(base64).toEqual('oldMockedBase64Data');
        expect(mimeType).toEqual('image/png');
      });

      it('should update streetcodeCacheUrlsMap due to updated streetcode.transliterationUrl', async () => {
        // Arrange
        await putOldStreetcodeInCache(
          streetcodeController,
          streetcodeService,
          'old-url',
        ); // important to place before other mocks

        mockStreetcodeService(streetcodeService);

        // Act
        const result = await streetcodeController.updateStreetcode(
          mockedStreetcodeUpdate,
        );
        const deletedIdOfOldStreetcode =
          streetcodeController.getStreetcodeCacheUrlsMap.get('old-url');
        const changedIdOfStreetcode =
          streetcodeController.getStreetcodeCacheUrlsMap.get(
            'mocked-streetcode-url',
          );

        // Assert
        expect(result).toEqual(updateStreetcodeApiResponse.data);
        expect(deletedIdOfOldStreetcode).toBeUndefined();
        expect(changedIdOfStreetcode).toEqual('1');
      });
    });

    describe('method DELETE(streetcode/delete)', () => {
      it('should delete streetcode and update cache', async () => {
        // Arrange
        const apiResponse = { status: 200, data: 1 } as AxiosResponse;
        jest
          .spyOn(streetcodeService, 'deleteStreetcode')
          .mockResolvedValueOnce(apiResponse);
        await putOldStreetcodeInCache(streetcodeController, streetcodeService);

        // Act
        const result = await streetcodeController.deleteStreetcode('1');

        // Assert
        expect(result).toContain('1');
        expect(
          streetcodeController.getStreetcodeCacheMap.get('1'),
        ).toBeUndefined();
        expect(
          streetcodeController.getStreetcodeCacheUrlsMap.get(
            'mocked-streetcode-url',
          ),
        ).toBeUndefined();
      });

      it('should NOT delete streetcode and NOT update cache', async () => {
        // Arrange
        jest
          .spyOn(streetcodeService, 'deleteStreetcode')
          .mockRejectedValue(apiError);
        await putOldStreetcodeInCache(streetcodeController, streetcodeService);

        // Act
        await expect(async () => {
          await streetcodeController.deleteStreetcode('1');
        }).rejects.toEqual(apiError);

        // Assert
        expect(streetcodeController.getStreetcodeCacheMap.get('1')).toEqual(
          oldMockedStreetcodeCache,
        );
        expect(
          streetcodeController.getStreetcodeCacheUrlsMap.get(
            'mocked-streetcode-url',
          ),
        ).toEqual('1');
      });
    });
  });
});
