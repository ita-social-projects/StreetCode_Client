import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { NewsService } from './news.service';
import News from '../../interfaces/News';
import { GetAppService } from '../../shared/get-app-service/get-app.service';
import base64ToUrl from '../../shared/utils/base64ToUrl';

@Controller()
export class NewsController {
  public newsCacheMap: Map<string, News> = new Map();
  public newsCacheUrlsMap: Map<string, string> = new Map();

  constructor(
    private readonly getAppService: GetAppService,
    private readonly newsService: NewsService,
  ) {
    this.loadNews();
  }

  @Get('news/:url')
  public async getNews(@Param('url') url: string) {
    try {
      if (!this.newsCacheUrlsMap.has(url)) {
        await this.addNewsToCache(url);
      }
      const id = this.newsCacheUrlsMap.get(url);
      const theNews = this.newsCacheMap.get(id);

      const meta = {
        description: theNews.title,
        image: base64ToUrl(theNews.image.base64, theNews.image.mimeType),
      };

      return this.getAppService.getApp(meta);
    } catch (error) {
      console.error('Error loading news:', error);
      return this.getAppService.getApp();
    }
  }

  @Put('news/update')
  public async updateNews(@Body() updatedNews: News) {
    const response = await this.newsService.updateNews(updatedNews);
    this.updateNewsCache(updatedNews);
    console.log('RESPONSE FROM API ON NEWS UPDATE', response);
    return response;
  }

  @Delete('news/delete/:id')
  public async deleteNews(@Param('id') id: string) {
    await this.newsService.deleteNews(id);
    this.deleteNewsFromCache(id);
    console.log('NEWS DELETED ' + id);
    return 'Deleted successfully ' + id;
  }

  private async loadNews() {
    try {
      const allNewsResponse = await this.newsService.getAllNews();
      allNewsResponse.data.forEach((news) => {
        this.newsCacheMap.set(news.id.toString(), news);
        this.newsCacheUrlsMap.set(news.url, news.id.toString());
      });
    } catch (error) {
      console.error('Error loading news:', error);
    }
  }

  private deleteNewsFromCache(id: string) {
    const url = this.newsCacheMap.get(id).url;
    this.newsCacheMap.delete(id);
    this.newsCacheUrlsMap.delete(url);
  }

  private updateNewsCache(updatedNews: News) {
    const id = updatedNews.id.toString();
    const oldNews = this.newsCacheMap.get(id);

    if (oldNews && oldNews.url !== updatedNews.url) {
      this.newsCacheUrlsMap.delete(oldNews.url);
      this.newsCacheUrlsMap.set(updatedNews.url, id);
    }
    this.newsCacheMap.set(updatedNews.id.toString(), updatedNews);
  }

  private async addNewsToCache(url: string) {
    const response = await this.newsService.getByUrl(url);
    const news = response.data;
    if (!news) {
      throw new NotFoundException(`News with ${url} url not found`);
    }
    this.newsCacheMap.set(news.id.toString(), news);
    this.newsCacheUrlsMap.set(news.url, news.id.toString());
  }
}
