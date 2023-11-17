import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class NewsService {
  constructor(private readonly httpService: HttpService) {}

  public async getAllNews(): Promise<AxiosResponse> {
    const url = 'https://stageback.streetcode.com.ua/api/news/getAll';
    return this.httpService.get(url).toPromise();
  }

  public async getByUrl(newsUrl: string): Promise<AxiosResponse> {
    const backUrl = 'https://stageback.streetcode.com.ua/api/news/getByUrl/';
    return this.httpService.get(backUrl + newsUrl).toPromise();
  }
}
