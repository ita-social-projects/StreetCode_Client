import { Module } from '@nestjs/common';
import { StreetcodeController } from './streetcode.controller';
import { HttpConfigModule } from '../../shared/http-config-module/http-config.module';
import { GetAppService } from '../../shared/get-app-service/get-app.service';
import { StreetcodeService } from './streetcode.service';

@Module({
  imports: [HttpConfigModule],
  providers: [GetAppService, StreetcodeService],
  controllers: [StreetcodeController],
})
export class StreetcodeModule {}
