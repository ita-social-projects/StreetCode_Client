import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientMiddleware } from './client.middleware';
import { NewsService } from './services/news/news.service';
import { NewsModule } from './services/news/news.module';
import { HttpModule } from '@nestjs/axios';
import {StreetcodeService} from "./services/streetcodes/streetcode.service"

@Module({
  imports: [HttpModule, NewsModule],
  providers: [NewsService, ClientService, StreetcodeService],
  controllers: [ClientController],
})
export class ClientModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClientMiddleware).forRoutes(ClientController);
  }
}
