import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Tag } from '../entities/tag.entity';

const DatabaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_USER_PASSWORD,
  database: process.env.DB_DATABASE_TEST,
  entities: [__dirname + '/../entities/*.entity.{js,ts}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: __dirname + '/../database/migrations',
  },
  synchronize: false,
  logging: true,
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
};

export = DatabaseConfig;
