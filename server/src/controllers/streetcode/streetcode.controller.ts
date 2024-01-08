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
      const isAdded = await this.addStreetcodeToCache(url);

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
    console.log('RESPONSE FROM API ON STREETCODE UPDATE', response);
    return response;
  }

  @Delete('streetcode/delete/:id')
  public async deleteStreetcode(@Param('id') id: string) {
    await this.streetcodeService.deleteStreetcode(id);
    this.deleteStreetcodeFromCache(id);
    console.log('STREETCODE DELETED ' + id);
    return 'Deleted successfully ' + id;
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
      console.error('Error loading streetcode:', error);
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
}
