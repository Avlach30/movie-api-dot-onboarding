import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';
import { AppConfig } from './config/app.config';
import { StudioModule } from './studio/studio.module';
import { MovieScheduleModule } from './schedule/schedule.module';
import { IpLoggerMidlleware } from './middleware/ip-logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(AppConfig),
    ScheduleModule.forRoot(),
    UserModule,
    MovieModule,
    StudioModule,
    MovieScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpLoggerMidlleware).forRoutes('*');
  }
}
