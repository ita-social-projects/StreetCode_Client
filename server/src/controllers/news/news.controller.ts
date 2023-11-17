import { Controller, Get, Param } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('api/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  public async getAll() {
    const result = await this.newsService.getAllNews();
    return result ?? null;
  }

  @Get('/:url')
  public async getByUrl(@Param('url') url: string) {
    const result = await this.newsService.getByUrl(url);
    return result ?? null;
  }
}
