import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { HttpConfigModule } from '../../../../shared/http-config/http-config.module';

@Module({
  imports: [HttpConfigModule],
  providers: [NewsService],
})
export class NewsModule {}
