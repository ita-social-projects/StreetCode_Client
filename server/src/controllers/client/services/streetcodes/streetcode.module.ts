import { Module } from '@nestjs/common';
import { StreetcodeService } from './streetcode.service';
import {HttpModule} from "@nestjs/axios"

@Module({
  imports: [HttpModule.register({
    baseURL: process.env.REACT_APP_BACKEND_URL,
  }),],
  providers: [StreetcodeService],
})
export class StreetcodeModule {}
