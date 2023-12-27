import { Body, Controller, Get, Param, Put, Delete } from '@nestjs/common';
import { ClientService } from './client.service';
import { NewsService } from './services/news/news.service';
import News from '../../interfaces/News';
import { StreetcodeService } from './services/streetcodes/streetcode.service';

@Controller()
export class ClientController {
  private newsCacheMap: Map<string, News> = new Map();
  private streetcodeCacheMap: Map<string, any> = new Map();
  private urlsToOmit: Array<string> = ['admin-panel'];

  constructor(
    private readonly clientService: ClientService,
    private readonly newsService: NewsService,
    private readonly streetcodeService: StreetcodeService,
  ) {
    this.loadNews();
    this.loadStreetcodes();
  }

  @Get('news/:url')
  public async getNews(@Param('url') url: string) {
    if (!this.newsCacheMap.has(url)) {
      await this.addNewsToCache(url);
    }

    const theNews = this.newsCacheMap.get(url);

    const meta = {
      description: theNews.title,
      image: this.base64ToUrl(theNews.image.base64, theNews.image.mimeType),
    };

    return this.clientService.getApp(meta);
  }

  @Put('news/:url')
  public async updateNews(
    @Param('url') url: string,
    @Body() updatedNews: News,
  ) {
    this.newsCacheMap.set(url, updatedNews);

    const response = await this.newsService.updateNews(updatedNews);
    console.log('RESPONSE FROM API', response);
    return response;
  }

  @Delete('news/delete/:id')
  public async deleteNews(@Param('id') id: string) {
    const response = await this.newsService.deleteNews(id);
    console.log(response);
    return response;
  }

  @Get(':url')
  public async getStreetcode(@Param('url') url: string) {
    if (this.urlsToOmit.find((toOmit) => toOmit === url)) {
      return this.clientService.getApp();
    }

    if (!this.streetcodeCacheMap.has(url)) {
      const isAdded = await this.addStreetcodeToCache(url);

      if (!isAdded) {
        return this.clientService.getApp();
      }
    }

    const streetcode = this.newsCacheMap.get(url);

    const meta = {
      title: streetcode.title,
      image: this.base64ToUrl(
        streetcode.image.base64,
        streetcode.image.mimeType,
      ),
    };

    return this.clientService.getApp(meta);
  }

  @Get('*')
  public async get() {
    return this.clientService.getApp();
  }

  private async loadNews() {
    try {
      const allNewsResponse = await this.newsService.getAllNews();
      allNewsResponse.data.forEach((news) => {
        this.newsCacheMap.set(news.url, news);
      });
    } catch (error) {
      console.error('Error loading news:', error);
    }
  }
  private async loadStreetcodes() {
    try {
      const allStreetcoderesponse =
        await this.streetcodeService.getAllStreetcodes();

      allStreetcoderesponse.data.streetcodes.forEach((streetcode) => {
        this.streetcodeService
          .getImagesOfStreetcode(streetcode.id)
          .then((data) => {
            this.streetcodeCacheMap.set(streetcode.transliterationUrl, {
              id: streetcode.id,
              title: streetcode.title,
              image: data[1] ? data[1] : data[0],
            });
          });
      });
    } catch (error) {
      console.error('Error loading streetcodes:', error);
    }
  }

  private async addNewsToCache(url: string) {
    try {
      const news = await this.newsService.getByUrl(url);
      this.newsCacheMap.set(news.data.url, news.data);
    } catch (error) {
      console.error('Error loading news:', error);
    }
  }
  private async addStreetcodeToCache(url: string) {
    try {
      const streetcodeResponse = await this.streetcodeService.getByUrl(url);
      const streetcode = streetcodeResponse.data;

      this.streetcodeService
        .getImagesOfStreetcode(streetcode.id)
        .then((data) => {
          this.streetcodeCacheMap.set(streetcode.transliterationUrl, {
            id: streetcode.id,
            title: streetcode.title,
            image: data[1] ? data[1] : data[0],
          });
        });

      return true;
    } catch (error) {
      console.error('Error loading streetcodes:', error);
      return false;
    }
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
