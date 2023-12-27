import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://localhost:5001/api',
    }),
  ],
  providers: [NewsService],
})
export class NewsModule {}
