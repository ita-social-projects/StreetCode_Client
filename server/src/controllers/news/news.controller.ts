import { Body, Controller, Get, Param, Put, Delete } from '@nestjs/common';
import { NewsService } from './news.service';
import News from '../../interfaces/News';
import { GetAppService } from '../../shared/get-app-service/get-app.service';
import base64ToUrl from '../../shared/utils/base64ToUrl';
import NEWS_CONSOLE_MESSAGES from './constants/console.constant';

@Controller()
export class NewsController {
  private newsCacheMap: Map<string, News> = new Map();
  private newsCacheUrlsMap: Map<string, string> = new Map();

  get getNewsCacheMap(): Map<string, News> {
    return new Map(this.newsCacheMap);
  }

  get getNewsCacheUrlsMap(): Map<string, string> {
    return new Map(this.newsCacheUrlsMap);
  }

  constructor(
    private readonly getAppService: GetAppService,
    private readonly newsService: NewsService,
  ) {
    this.loadNews();
  }

  @Get('news/:url')
  public async getNews(@Param('url') url: string) {
    if (!this.newsCacheUrlsMap.has(url)) {
      const isAdded = await this.addNewsToCacheByUrl(url);
      if (!isAdded) {
        return this.getAppService.getApp();
      }
    }
    const id = this.newsCacheUrlsMap.get(url);
    const theNews = this.newsCacheMap.get(id);
    const {
      title,
      image: { base64, mimeType },
    } = theNews;

    const meta = {
      description: title,
      image: base64ToUrl(base64, mimeType),
    };

    return this.getAppService.getApp(meta);
  }

  @Put('news/update')
  public async updateNews(@Body() updatedNews: News) {
    const response = await this.newsService.updateNews(updatedNews);
    this.updateNewsCache(updatedNews);
    console.log(NEWS_CONSOLE_MESSAGES.newsUpdated, response);
    return response.data;
  }

  @Delete('news/delete/:id')
  public async deleteNews(@Param('id') id: string) {
    await this.newsService.deleteNews(id);
    this.deleteNewsFromCache(id);

    const message = NEWS_CONSOLE_MESSAGES.newsDeleted + id;
    console.log(message);
    return message;
  }

  private async loadNews() {
    try {
      const allNewsResponse = await this.newsService.getAllNews();
      allNewsResponse.data.forEach((news) => {
        // important to don't override cache of already updated news
        if (!this.newsCacheMap.has(news.id.toString())) {
          this.addNewsToCache(news);
        }
      });
    } catch (error) {
      console.error(NEWS_CONSOLE_MESSAGES.errorOnLoadingNews, error);
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
    this.newsCacheMap.set(id, updatedNews);
  }

  private async addNewsToCacheByUrl(url: string): Promise<boolean> {
    try {
      const response = await this.newsService.getByUrl(url);
      const news = response.data;

      this.addNewsToCache(news);
      return true;
    } catch {
      return false;
    }
  }

  private addNewsToCache(news: News) {
    const id = news.id.toString();
    this.newsCacheMap.set(id, news);
    this.newsCacheUrlsMap.set(news.url, id);
  }
}
