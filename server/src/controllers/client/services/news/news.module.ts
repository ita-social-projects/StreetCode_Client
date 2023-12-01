import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import {HttpModule} from "@nestjs/axios"

@Module({
  imports: [HttpModule.register({
    baseURL: process.env.REACT_APP_BACKEND_URL,
  }),],
  providers: [NewsService],
})
export class NewsModule {}
