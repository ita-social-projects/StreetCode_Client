import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as path from 'path';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: () => void) {
    if (/[^\\/]+\.[^\\/]+$/.test(req.path)) {
      const file = this.getAssetPath(req.path);
      Logger.log('FILE:', file);
      if (fs.existsSync(file)) {
        res.sendFile(file, (err) => {
          if (err) {
            res.append(err.message).end();
          }
        });
      } else {
        res.status(404).end();
      }
    } else {
      return next();
    }
  }

  public getAssetPath(url: any) {
    const basePath = process.env.CLIENT_BUILD_PATH;
    return path.resolve(path.join(basePath, url));
  }
}
