import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { NewsService } from './services/news/news.service';
import News from '../../interfaces/News';
import { StreetcodeService } from './services/streetcodes/streetcode.service';
import { StreetcodeImageEnum } from '../../enums/StreetcodeImageEnum';
import Image from '../../interfaces/Image';
import { StreetcodeUpdate } from '../../interfaces/StreetcodeUpdate';

@Controller()
export class ClientController {
  public newsCacheMap: Map<string, News> = new Map();
  public newsCacheUrlsMap: Map<string, string> = new Map();
  public streetcodeCacheMap: Map<string, any> = new Map();
  public streetcodeCacheUrlsMap: Map<string, string> = new Map();
  public urlsToOmit: Array<string> = ['admin-panel'];

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
    try {
      if (!this.newsCacheUrlsMap.has(url)) {
        await this.addNewsToCache(url);
      }
      const id = this.newsCacheUrlsMap.get(url);
      const theNews = this.newsCacheMap.get(id);

      const meta = {
        description: theNews.title,
        image: this.base64ToUrl(theNews.image.base64, theNews.image.mimeType),
      };

      return this.clientService.getApp(meta);
    } catch (error) {
      console.error('Error loading news:', error);
      return this.clientService.getApp();
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
    try {
      await this.newsService.deleteNews(id);
      this.deleteNewsFromCache(id);
      console.log('NEWS DELETED ' + id);
      return 'Deleted successfully ' + id;
    } catch (error) {
      console.log('ERROR FROM API ON NEWS DELETE ' + id);
      throw new BadRequestException(error);
    }
  }

  @Get(':url')
  public async getStreetcode(@Param('url') url: string) {
    if (this.urlsToOmit.find((toOmit) => toOmit === url)) {
      return this.clientService.getApp();
    }

    if (!this.streetcodeCacheUrlsMap.has(url)) {
      const isAdded = await this.addStreetcodeToCache(url);

      if (!isAdded) {
        return this.clientService.getApp();
      }
    }
    const id = this.streetcodeCacheUrlsMap.get(url);
    const streetcode = this.streetcodeCacheMap.get(id);

    const meta = {
      title: streetcode.title,
      image: this.base64ToUrl(
        streetcode.image.base64,
        streetcode.image.mimeType,
      ),
    };

    return this.clientService.getApp(meta);
  }

  @Put('streetcode/update')
  public async updateStreetcode(@Body() updatedStreetcode: StreetcodeUpdate) {
    const response =
      await this.streetcodeService.updateStreetcode(updatedStreetcode);
    this.updateStreetcodeCache(updatedStreetcode);
    console.log('RESPONSE FROM API ON STREETCODE UPDATE', response);
    return response;
  }

  @Delete('streetcode/delete/:id')
  public async deleteStreetcode(@Param('id') id: string) {
    try {
      await this.streetcodeService.deleteStreetcode(id);
      this.deleteStreetcodeFromCache(id);
      console.log('STREETCODE DELETED ' + id);
      return 'Deleted successfully ' + id;
    } catch (error) {
      console.log('ERROR FROM API ON STREETCODE DELETE ' + id);
      throw new BadRequestException(error);
    }
  }

  @Get('*')
  public async get() {
    return this.clientService.getApp();
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

  private async loadStreetcodes() {
    try {
      const allStreetcoderesponse =
        await this.streetcodeService.getAllStreetcodes();

      const imagePromises = allStreetcoderesponse.data.streetcodes.map(
        (streetcode) => {
          return this.streetcodeService
            .getImagesOfStreetcode(streetcode.id)
            .then((response) => {
              const data = response.data;
              if (!this.streetcodeCacheMap.has(streetcode.id.toString())) {
                this.streetcodeCacheMap.set(streetcode.id.toString(), {
                  title: streetcode.title,
                  image: this.findGrayImage(data),
                });

                this.streetcodeCacheUrlsMap.set(
                  streetcode.transliterationUrl,
                  streetcode.id.toString(),
                );
              }
            });
        },
      );
      console.log('PROMISES', imagePromises.length);
      await Promise.all(imagePromises);
    } catch (error) {
      console.error('Error loading streetcodes:', error);
    }
  }

  private deleteNewsFromCache(id: string) {
    const url = this.newsCacheMap.get(id).url;
    this.newsCacheMap.delete(id);
    this.newsCacheUrlsMap.delete(url);
  }

  private deleteStreetcodeFromCache(id: string) {
    const url = this.streetcodeCacheMap.get(id).transliterationUrl;
    this.streetcodeCacheMap.delete(id);
    this.streetcodeCacheUrlsMap.delete(url);
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

  private updateStreetcodeCache(updatedStreetcode: any) {
    const id = updatedStreetcode.id.toString();
    const oldStreetcode = this.streetcodeCacheMap.get(id);

    if (!oldStreetcode) {
      this.streetcodeCacheUrlsMap.set(updatedStreetcode.transliterationUrl, id);
    } else {
      if (
        oldStreetcode.transliterationUrl !==
        updatedStreetcode.transliterationUrl
      ) {
        this.streetcodeCacheUrlsMap.delete(oldStreetcode.transliterationUrl);
        this.streetcodeCacheUrlsMap.set(
          updatedStreetcode.transliterationUrl,
          id,
        );
      }
    }

    this.streetcodeService.getImagesOfStreetcode(id).then((response) => {
      const data = response.data;
      this.streetcodeCacheMap.set(id, {
        title: updatedStreetcode.title,
        transliterationUrl: updatedStreetcode.transliterationUrl,
        image: this.findGrayImage(data),
      });
    });
  }

  private async addNewsToCache(url: string) {
    const response = await this.newsService.getByUrl(url);
    const news = response.data;
    if (!news) {
      throw new BadRequestException(`News with ${url} url not found`);
    }
    this.newsCacheMap.set(news.id.toString(), news);
    this.newsCacheUrlsMap.set(news.url, news.id.toString());
  }

  private async addStreetcodeToCache(url: string) {
    try {
      const streetcodeResponse = await this.streetcodeService.getByUrl(url);
      const streetcode = streetcodeResponse.data;

      await this.streetcodeService
        .getImagesOfStreetcode(streetcode.id)
        .then((response) => {
          const data = response.data;

          this.streetcodeCacheMap.set(streetcode.id.toString(), {
            title: streetcode.title,
            image: this.findGrayImage(data),
          });

          this.streetcodeCacheUrlsMap.set(
            streetcode.transliterationUrl,
            streetcode.id.toString(),
          );
        });

      return true;
    } catch (error) {
      console.error('Error loading streetcodes:', error);
      return false;
    }
  }
  private findGrayImage(images: Image[]) {
    return images.find(
      (image) =>
        image.imageDetails?.alt ===
        StreetcodeImageEnum.blackandwhite.toString(),
    );
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
