import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';

@Module({
  controllers: [ClientController],
})
export class ClientModule {}
