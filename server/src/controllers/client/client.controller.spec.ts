import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { GetAppService } from '../../shared/get-app-service/get-app.service';
import extractMetaTags from '../../shared/utils/extractMetaTags';
import DEFAULT_META from '../../shared/get-app-service/constants/defaultMeta.constant';

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
      // Assert

      // Act
      const indexHTML = await controller.get();
      const metaTags = extractMetaTags(indexHTML as string);
      const { title, description, image } = DEFAULT_META;

      // Arrange
      expect(metaTags['og:description']).toEqual(description);
      expect(metaTags['twitter:card']).toEqual(description);
      expect(metaTags['og:image']).toEqual(image);
      expect(metaTags['og:title']).toEqual(title);
    });
  });
});
