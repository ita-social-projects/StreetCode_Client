import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientMiddleware } from './client.middleware';
import { NewsService } from '../news/news.service';
import { NewsModule } from '../news/news.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, NewsModule],
  providers: [NewsService, ClientService],
  controllers: [ClientController],
})
export class ClientModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClientMiddleware).forRoutes(ClientController);
  }
}
