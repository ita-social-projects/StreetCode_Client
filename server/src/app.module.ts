import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpConfigModule } from './shared/http-config-module/http-config.module';
import { NewsController } from './controllers/news/news.controller';
import { StreetcodeController } from './controllers/streetcode/streetcode.controller';
import { APP_FILTER } from '@nestjs/core';
import { ApiExceptionFilter } from './shared/api-exeption-filter/api-exeption.filter';
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
  providers: [
    NewsService,
    StreetcodeService,
    GetAppService,
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FileMiddleware)
      .forRoutes(NewsController, StreetcodeController, ClientController);
  }
}
