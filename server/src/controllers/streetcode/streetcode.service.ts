import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { StreetcodeUpdate } from '../../interfaces/StreetcodeUpdate';

@Injectable()
export class StreetcodeService {
  constructor(private readonly httpService: HttpService) {}

  public async getAllStreetcodes(): Promise<AxiosResponse> {
    const url = '/streetcode/getAll';
    return this.httpService.get(url).toPromise();
  }

  public async getImagesOfStreetcode(id: string): Promise<AxiosResponse> {
    const url = '/image/getByStreetcodeId/';
    return this.httpService.get(url + id).toPromise();
  }

  public async getByUrl(url: string): Promise<AxiosResponse> {
    const backUrl = '/streetcode/getByTransliterationUrl/';
    return this.httpService.get(backUrl + url).toPromise();
  }

  public async updateStreetcode(
    streetcode: StreetcodeUpdate,
  ): Promise<AxiosResponse> {
    const backUrl = '/streetcode/update';
    return this.httpService.put(backUrl, streetcode).toPromise();
  }

  public async deleteStreetcode(id: string): Promise<AxiosResponse> {
    const backUrl = '/streetcode/delete/' + id;
    return this.httpService.delete(backUrl).toPromise();
  }
}
