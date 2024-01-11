import { Controller, Get } from '@nestjs/common';
import { GetAppService } from '../../shared/get-app-service/get-app.service';

@Controller()
export class ClientController {
  constructor(private readonly getAppService: GetAppService) {}

  @Get('*')
  public async get() {
    return this.getAppService.getApp();
  }
}
