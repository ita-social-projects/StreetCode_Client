import { Module } from '@nestjs/common';
import { StreetcodeService } from './streetcode.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://localhost:5001/api',
    }),
  ],
  providers: [StreetcodeService],
})
export class StreetcodeModule {}
