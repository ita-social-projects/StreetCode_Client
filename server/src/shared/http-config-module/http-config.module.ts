import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { config } from 'dotenv';
config();

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.BACKEND_URL,
    }),
  ],
  exports: [HttpModule],
})
export class HttpConfigModule {}
