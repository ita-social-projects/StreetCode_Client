import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientController } from './controllers/client/client.controller';
import { ClientService } from './controllers/client/client.service';
import { ClientModule } from './controllers/client/client.module';
import { NewsService } from './controllers/client/services/news/news.service';
import { NewsModule } from './controllers/client/services/news/news.module';
import { StreetcodeService } from './controllers/client/services/streetcodes/streetcode.service';
import { StreetcodeModule } from './controllers/client/services/streetcodes/streetcode.module';
import { HttpConfigModule } from './shared/http-config/http-config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientModule,
    NewsModule,
    StreetcodeModule,
    HttpConfigModule,
  ],
  controllers: [ClientController],
  providers: [ClientService, NewsService, StreetcodeService],
})
export class AppModule {}
