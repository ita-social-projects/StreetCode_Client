import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://stageback.streetcode.com.ua/api',
    }),
  ],
  exports: [HttpModule],
})
export class HttpConfigModule {}
