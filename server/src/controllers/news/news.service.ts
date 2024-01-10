import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import News from '../../interfaces/News';

@Injectable()
export class NewsService {
  constructor(private readonly httpService: HttpService) {}

  public async getAllNews(): Promise<AxiosResponse> {
    const url = '/news/getAll';
    return this.httpService.get(url).toPromise();
  }

  public async getByUrl(newsUrl: string): Promise<AxiosResponse> {
    const backUrl = '/news/getByUrl/';
    return this.httpService.get(backUrl + newsUrl).toPromise();
  }

  public async updateNews(news: News): Promise<AxiosResponse> {
    const backUrl = '/news/update';
    return this.httpService.put(backUrl, news).toPromise();
  }

  public async deleteNews(id: string): Promise<AxiosResponse> {
    const backUrl = '/news/delete/' + id;
    return this.httpService.delete(backUrl).toPromise();
  }
}
