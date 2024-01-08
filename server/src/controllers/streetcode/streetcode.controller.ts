import { Body, Controller, Get, Param, Put, Delete } from '@nestjs/common';
import { StreetcodeService } from './streetcode.service';
import { StreetcodeImageEnum } from '../../enums/StreetcodeImageEnum';
import Image from '../../interfaces/Image';
import { StreetcodeUpdate } from '../../interfaces/StreetcodeUpdate';
import { GetAppService } from '../../shared/get-app-service/get-app.service';
import base64ToUrl from '../../shared/utils/base64ToUrl';

@Controller()
export class StreetcodeController {
  public streetcodeCacheMap: Map<string, any> = new Map();
  public streetcodeCacheUrlsMap: Map<string, string> = new Map();
  public urlsToOmit: Array<string> = ['admin-panel'];

  constructor(
    private readonly getAppService: GetAppService,
    private readonly streetcodeService: StreetcodeService,
  ) {
    this.loadStreetcodes();
  }

  @Get(':url')
  public async getStreetcode(@Param('url') url: string) {
    if (this.urlsToOmit.find((toOmit) => toOmit === url)) {
      return this.getAppService.getApp();
    }

    if (!this.streetcodeCacheUrlsMap.has(url)) {
      const isAdded = await this.addStreetcodeToCacheByUrl(url);

      if (!isAdded) {
        return this.getAppService.getApp();
      }
    }
    const id = this.streetcodeCacheUrlsMap.get(url);
    const streetcode = this.streetcodeCacheMap.get(id);

    const meta = {
      title: streetcode.title,
      image: base64ToUrl(streetcode.image.base64, streetcode.image.mimeType),
    };

    return this.getAppService.getApp(meta);
  }

  @Put('streetcode/update')
  public async updateStreetcode(@Body() updatedStreetcode: StreetcodeUpdate) {
    const response =
      await this.streetcodeService.updateStreetcode(updatedStreetcode);
    this.updateStreetcodeCache(updatedStreetcode);
    console.log('STREETCODE UPDATED: ', response);
    return response.data;
  }

  @Delete('streetcode/delete/:id')
  public async deleteStreetcode(@Param('id') id: string) {
    await this.streetcodeService.deleteStreetcode(id);
    this.deleteStreetcodeFromCache(id);

    const message = 'STREETCODE DELETED ' + id;
    console.log(message);
    return message;
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
              if (!this.streetcodeCacheMap.has(streetcode.id.toString())) {
                streetcode.images = response.data;

                this.addStreetcodeToCache(streetcode);
              }
            });
        },
      );

      await Promise.all(imagePromises);
    } catch (error) {
      console.error('Error loading streetcode:', error);
    }
  }

  private deleteStreetcodeFromCache(id: string) {
    const url = this.streetcodeCacheMap.get(id).transliterationUrl;
    this.streetcodeCacheMap.delete(id);
    this.streetcodeCacheUrlsMap.delete(url);
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
      }
    }

    this.streetcodeService.getImagesOfStreetcode(id).then((response) => {
      updatedStreetcode.images = response.data;

      this.addStreetcodeToCache(updatedStreetcode);
    });
  }

  private async addStreetcodeToCacheByUrl(url: string) {
    try {
      const streetcodeResponse = await this.streetcodeService.getByUrl(url);
      const streetcode = streetcodeResponse.data;

      await this.streetcodeService
        .getImagesOfStreetcode(streetcode.id)
        .then((response) => {
          streetcode.images = response.data;

          this.addStreetcodeToCache(streetcode);
        });

      return true;
    } catch {
      return false;
    }
  }

  private addStreetcodeToCache(streetcode: StreetcodeUpdate) {
    const id = streetcode.id.toString();

    this.streetcodeCacheMap.set(id, {
      title: streetcode.title,
      image: this.findGrayImage(streetcode.images),
      transliterationUrl: streetcode.transliterationUrl,
    });

    this.streetcodeCacheUrlsMap.set(streetcode.transliterationUrl, id);
  }

  private findGrayImage(images: Image[]) {
    return images.find(
      (image) =>
        image.imageDetails?.alt ===
        StreetcodeImageEnum.blackandwhite.toString(),
    );
  }
}
