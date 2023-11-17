import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import { Logger } from '@nestjs/common';

interface IPageMetadata {
  title?: string;
  description?: string;
  image?: string;
}

const DEFAULT_META: IPageMetadata = {
  title: '',
  description:
    '«Стріткод: історія на кожному кроці» — платформа про імена в назвах вулиць.',
  image: 'https://imageupload.io/ib/FxPYSMIqLgKs1u6_1698303095.webp',
};

@Injectable()
export class ClientService {
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
            data = data.replace(/__PAGE_TITLE__/g, pageMetadata.title);
            data = data.replace(
              /__PAGE_DESCRIPTION__/g,
              pageMetadata.description,
            );
            data = data.replace(/__PAGE_IMAGE__/g, pageMetadata.image);
            resolve(data);
          }
        },
      );
    });
  }
}
