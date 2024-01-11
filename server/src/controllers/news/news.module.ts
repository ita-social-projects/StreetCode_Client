import { Module } from '@nestjs/common';

import { NewsController } from './news.controller';
import { HttpConfigModule } from '../../shared/http-config-module/http-config.module';
import { GetAppService } from '../../shared/get-app-service/get-app.service';
import { NewsService } from './news.service';

@Module({
  imports: [HttpConfigModule, NewsModule],
  providers: [NewsService, GetAppService],
  controllers: [NewsController],
})
export class NewsModule {}
