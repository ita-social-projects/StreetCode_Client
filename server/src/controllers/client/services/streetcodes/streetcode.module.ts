import { Module } from '@nestjs/common';
import { StreetcodeService } from './streetcode.service';
import { HttpConfigModule } from '../../../../shared/http-config/http-config.module';

@Module({
  imports: [HttpConfigModule],
  providers: [StreetcodeService],
})
export class StreetcodeModule {}
