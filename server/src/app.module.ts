import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ClientController } from './controllers/client/client.controller';
import { ClientService } from './controllers/client/client.service';
import { ClientModule } from './controllers/client/client.module';
import { NewsService } from './controllers/news/news.service';
import { NewsModule } from './controllers/news/news.module';
import { HttpModule } from '@nestjs/axios';

// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientModule,
    NewsModule,
    HttpModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '../..', 'dist'),
    //   serveRoot: '/app',
    // }),
  ],
  controllers: [AppController, ClientController],
  providers: [AppService, ClientService, NewsService],
})
export class AppModule {}
