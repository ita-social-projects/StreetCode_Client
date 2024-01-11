import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import { Logger } from '@nestjs/common';
import META_PLACEHOLDERS from './constants/metaPlaceholders.constant';
import DEFAULT_META, { IPageMetadata } from './constants/defaultMeta.constant';

@Injectable()
export class GetAppService {
  public async getApp(pageMetadata: IPageMetadata = DEFAULT_META) {
    const basePath = process.env.CLIENT_BUILD_PATH;
    const filePath = path.resolve(path.join(basePath, 'index.html'));
    Logger.log('PATH:', filePath);
    return new Promise((resolve, reject) => {
      fs.readFile(
        filePath,
        'utf8',
        (err: NodeJS.ErrnoException, data: string) => {
          if (err) {
            reject(err);
          } else {
            data = data.replaceAll(
              META_PLACEHOLDERS.title,
              pageMetadata?.title ?? DEFAULT_META.title,
            );
            data = data.replaceAll(
              META_PLACEHOLDERS.description,
              pageMetadata?.description ?? DEFAULT_META.description,
            );
            data = data.replaceAll(
              META_PLACEHOLDERS.image,
              pageMetadata?.image ?? DEFAULT_META.image,
            );
            resolve(data);
          }
        },
      );
    });
  }
}
