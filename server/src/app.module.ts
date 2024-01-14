import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpConfigModule } from './shared/http-config-module/http-config.module';
import { NewsController } from './controllers/news/news.controller';
import { StreetcodeController } from './controllers/streetcode/streetcode.controller';
import { FileMiddleware } from './shared/file-middleware/file.middleware';
import { GetAppService } from './shared/get-app-service/get-app.service';
import { NewsService } from './controllers/news/news.service';
import { StreetcodeService } from './controllers/streetcode/streetcode.service';
import { ClientController } from './controllers/client/client.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpConfigModule,
  ],
  controllers: [StreetcodeController, NewsController, ClientController],
  providers: [NewsService, StreetcodeService, GetAppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FileMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
