import { Body, Controller, Get, Param, Put, Delete } from '@nestjs/common';
import { StreetcodeService } from './streetcode.service';
import { StreetcodeImageEnum } from '../../enums/StreetcodeImageEnum';
import Image from '../../interfaces/Image';
import { StreetcodeUpdate } from '../../interfaces/StreetcodeUpdate';
import { GetAppService } from '../../shared/get-app-service/get-app.service';
import base64ToUrl from '../../shared/utils/base64ToUrl';
import URLS_TO_OMIT from './constants/urlsToOmit.constant';
import { StreetcodeCache } from '../../interfaces/StreetcodeCache';
import { Streetcode } from '../../interfaces/Streetcode';
import STREETCODE_CONSOLE_MESSAGES from './constants/console.constant';

@Controller()
export class StreetcodeController {
  private streetcodeCacheMap: Map<string, StreetcodeCache> = new Map();
  private streetcodeCacheUrlsMap: Map<string, string> = new Map();

  get getStreetcodeCacheMap(): Map<string, StreetcodeCache> {
    return new Map(this.streetcodeCacheMap);
  }

  get getStreetcodeCacheUrlsMap(): Map<string, string> {
    return new Map(this.streetcodeCacheUrlsMap);
  }

  constructor(
    private readonly getAppService: GetAppService,
    private readonly streetcodeService: StreetcodeService,
  ) {
    this.loadStreetcodes();
  }

  @Get(':url')
  public async getStreetcode(@Param('url') url: string) {
    if (URLS_TO_OMIT.find((toOmit) => toOmit === url)) {
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
    console.log(STREETCODE_CONSOLE_MESSAGES.streetcodeUpdated, response);
    return response.data;
  }

  @Delete('streetcode/delete/:id')
  public async deleteStreetcode(@Param('id') id: string) {
    await this.streetcodeService.deleteStreetcode(id);
    this.deleteStreetcodeFromCache(id);

    const message = STREETCODE_CONSOLE_MESSAGES.streetcodeDeleted + id;
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
              // important to dont override cache of already updated streetcodes
              if (!this.streetcodeCacheMap.has(streetcode.id.toString())) {
                const images = response.data;

                this.addStreetcodeToCache(streetcode, images);
              }
            });
        },
      );

      await Promise.all(imagePromises);
    } catch (error) {
      console.error(
        STREETCODE_CONSOLE_MESSAGES.errorOnLoadingStreetcodes,
        error,
      );
    }
  }

  private deleteStreetcodeFromCache(id: string) {
    const url = this.streetcodeCacheMap.get(id).transliterationUrl;
    this.streetcodeCacheMap.delete(id);
    this.streetcodeCacheUrlsMap.delete(url);
  }

  private updateStreetcodeCache(updatedStreetcode: StreetcodeUpdate) {
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
      const images = response.data;

      this.addStreetcodeToCache(updatedStreetcode as Streetcode, images);
    });
  }

  private async addStreetcodeToCacheByUrl(url: string) {
    try {
      const streetcodeResponse = await this.streetcodeService.getByUrl(url);
      const streetcode = streetcodeResponse.data as Streetcode;

      await this.streetcodeService
        .getImagesOfStreetcode(streetcode.id.toString())
        .then((response) => {
          const images = response.data;

          this.addStreetcodeToCache(streetcode, images);
        });

      return true;
    } catch {
      return false;
    }
  }

  private addStreetcodeToCache(streetcode: Streetcode, images: Image[]) {
    const id = streetcode.id.toString();

    this.streetcodeCacheMap.set(id, {
      title: streetcode.title,
      image: this.findGrayImage(images),
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
