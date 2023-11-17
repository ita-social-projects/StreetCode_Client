import { Controller, Get, Param } from '@nestjs/common';
import { ClientService } from './client.service';
import { NewsService } from '../news/news.service';

@Controller()
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly newsService: NewsService,
  ) {}

  @Get('news/:url')
  public async getRecipe(@Param('url') url: string) {
    // const allNews = await this.newsService.getAllNews();
    const response = await this.newsService.getByUrl(url);
    const theNews = response.data;

    const meta = {
      description: theNews.title,
      image: this.base64ToUrl(
        theNews.image.base64ToUrl,
        theNews.image.mimeType,
      ),
    };

    return this.clientService.getApp(meta);
  }

  @Get('*')
  public async get() {
    return this.clientService.getApp();
  }

  base64ToUrl = (
    base64Data: string | undefined,
    mimeType: string | undefined,
  ): string | undefined => {
    if (base64Data && mimeType) {
      const result = `data:${mimeType};base64,${base64Data}`;
      return result;
    }
  };
}
