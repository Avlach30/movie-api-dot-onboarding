import { join } from 'path';

import { ConfigModule } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export const AppConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_USER_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        join(__dirname, '../', '../', 'dist', 'entities/**/*.entity{ .ts,.js}'),
      ],
      synchronize: false,
      migrations: [
        join(__dirname, '../', '../', 'dist', 'migrations/*{.ts,.js}'),
      ],
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
    };
  },
};
