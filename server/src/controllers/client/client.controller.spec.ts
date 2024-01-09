// client.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { GetAppService } from '../../shared/get-app-service/get-app.service';
import extractMetaTags from '../../shared/utils/extractMetaTags';
import DEFAULT_META from '../../shared/get-app-service/constants/defaultMeta';

process.env.CLIENT_BUILD_PATH = './src/for-tests';

describe('ClientController', () => {
  let controller: ClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [GetAppService],
    }).compile();

    controller = module.get<ClientController>(ClientController);
  });

  describe('Get', () => {
    it('should return app content', async () => {
      const indexHTML = await controller.get();
      const metaTags = extractMetaTags(indexHTML as string);

      expect(metaTags['og:description']).toEqual(DEFAULT_META.description);
      expect(metaTags['twitter:card']).toEqual(DEFAULT_META.description);
      expect(metaTags['og:image']).toEqual(DEFAULT_META.image);
      expect(metaTags['og:title']).toEqual(DEFAULT_META.title);
    });
  });
});
