import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ClientController } from './controllers/client/client.controller';
import { ClientService } from './controllers/client/client.service';
import { ClientModule } from './controllers/client/client.module';
import { NewsService } from './controllers/client/services/news/news.service';
import { NewsModule } from './controllers/client/services/news/news.module';
import { StreetcodeService } from './controllers/client/services/streetcodes/streetcode.service';
import { StreetcodeModule } from './controllers/client/services/streetcodes/streetcode.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientModule,
    NewsModule,
    StreetcodeModule,
    HttpModule.register({
      baseURL: process.env.REACT_APP_BACKEND_URL,
    }),
  ],
  controllers: [AppController, ClientController],
  providers: [AppService, ClientService, NewsService, StreetcodeService],
})
export class AppModule {}
